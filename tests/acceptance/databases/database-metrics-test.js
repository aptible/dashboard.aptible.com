import Ember from "ember";
import {module, test} from "qunit";
import startApp from "../../helpers/start-app";
import { stubRequest } from "../../helpers/fake-server";

let App;

let databaseId = "1",
    serviceId = "2",
    releaseId = "3",
    databaseHandle = "my-db-handle",
    stackHandle = "my-stack-handle",
    stackId = "my-stack-id";

let databaseUrl = `/databases/${databaseId}`,
    databaseMetricsUrl = `${databaseUrl}/metrics`;

function makeContainers() {
  // In practice, there won't be several layers here, but it's fine to protect
  // against potential future changes.
  return [
  {
    id: 1,
    docker_name: "a1a1a1a1a1a1a1a1a1a1a1",
    layer: "proxy"
  },
  {
    id: 2,
    docker_name: "a3a3a3a3a3a3a3a3a3a3a3",
    layer: "database"
  }
  ];
}


let release = {
  id: releaseId,
  _links: {
    containers: {
      href: `/releases/${releaseId}/containers`
    }
  }
};

let stack = {
  id: stackId,
  handle: stackHandle
};

let service = {
  id: serviceId,
  process_type: "elasticsearch",
  command: null,  // No command for databases
  _links: {
    current_release: {
      href: `/releases/${releaseId}`
    }
  }
};

let database = {
  id: databaseId,
  handle: databaseHandle,
  _links: {
    account: { href: `/accounts/${stackId}` } ,
    service: { href: `/services/${serviceId}` }
  }
};

function makeValidMetricData() {
  return {
    x: "x",
    columns: [
      ["x", 1, 2, 3, 4, 5, 6],
      ["a3a3a3a3a3a3a3a3a3a3a3", 1, 2, 3, 4]
    ]
  };
}


module("Acceptance: Database Service Metrics", {
  beforeEach: function() {
    App = startApp();
    stubStacks();
    stubOrganizations();
    stubStack(stack);
    stubDatabase(database);
    stubRequest("get", `/releases/${releaseId}`, function() {
      return this.success(release);
    });

    stubRequest("get", `/services/${serviceId}`, function() {
      return this.success(service);
    });
  },
  afterEach: function() {
    Ember.run(App, "destroy");
  }
});

test("it passes a database container ID, with default horizon and auth token; shows graph", function(assert) {
  stubRequest("get", `/releases/${releaseId}/containers`, function() {
    return this.success({_embedded: {containers: makeContainers()}});
  });

  stubRequest("get", "/proxy/:containers", function(request) {
    assert.equal(request.params.containers, "2");
    assert.equal(request.queryParams.horizon, "1h");
    assert.equal(request.requestHeaders["Authorization"], "Bearer my-token");
    return this.success(makeValidMetricData());
  });

  signInAndVisit(databaseMetricsUrl);

  andThen(() => {
    findWithAssert('h3:contains(elasticsearch)');

    // Check that we don't show the memory limit since none is set
    assert.equal(find("input[name$='show-memory-limit']").length, 0, "Show memory limit button is shown!");

    // Check that we rendered the chart
    let chart = findWithAssert("div.c3-chart-component");
    assert.ok(chart.text().indexOf("Memory usage") > -1, "Memory usage label is not shown!");
    assert.ok(chart.text().indexOf("a3a3a3a3a3a3a3a3a3a3a3") > -1, "Container A3 is missing");
    assert.ok(chart.text().indexOf("a1a1a1a1a1a1a1a1a1a1a1") === -1, "Container A1 is present");
  });
});

test("it reloads and redraws data when reload is clicked", function(assert) {
  stubRequest("get", `/releases/${releaseId}/containers`, function() {
    return this.success({_embedded: {containers: makeContainers()}});
  });

  let cpuMetricResponses = [makeValidMetricData(), makeValidMetricData()];
  let memoryMetricResponses = [makeValidMetricData(), makeValidMetricData()];
  memoryMetricResponses[0].columns[1].push(99999);

  stubRequest("get", "/proxy/:containers", function(request) {
    if (request.queryParams.metric === "memory") {
      return this.success(memoryMetricResponses.pop());
    }

    if (request.queryParams.metric === "cpu") {
      return this.success(cpuMetricResponses.pop());
    }

    assert.ok(false, `Received invalid metric: ${request.queryParams.metric}`);
  });

  signInAndVisit(databaseMetricsUrl);

  andThen(() => {
    clickButton("Reload");
  });

  andThen(() => {
    assert.equal(memoryMetricResponses.length, 0, "Not enough requests!");
    assert.equal(cpuMetricResponses.length, 0, "Not enough requests!");
    let chart = findWithAssert("div.c3-chart-component");
    // Expect the chart to resize to show the new data point
    assert.ok(chart.text().indexOf("100000 MB") > -1, "Memory not shown!");
  });
});

test("it shows memory limit checkbox and memory limit line if limit exists", function (assert) {
  stubRequest("get", `/releases/${releaseId}/containers`, function() {
    let containers = makeContainers();
    containers[1].memory_limit = 99999;
    return this.success({_embedded: {containers: containers}});
  });

  stubRequest("get", "/proxy/:containers", function() {
    return this.success(makeValidMetricData());
  });

  signInAndVisit(databaseMetricsUrl);

  andThen(() => {
    let checkbox = find("input[name$='show-memory-limit']");
    checkbox.prop('checked', true);
    checkbox.change();
  });

  andThen(() => {
    // Check that we don't show the memory limit since none is set
    assert.equal(find("input[name$='show-memory-limit']").length, 1, "Show memory limit button is not shown!");

    let chart = findWithAssert("div.c3-chart-component");
    assert.ok(chart.text().indexOf("Memory limit (99999 MB)") > -1, "Memory limit not shown!");
    assert.ok(chart.text().indexOf("100000 MB") > -1, "Chart did not resize!");
  });
});

test("it can change the horizon", function (assert) {
  let expectedHorizons = ["1d", "1d", "1h", "1h"];

  stubRequest("get", `/releases/${releaseId}/containers`, function() {
    return this.success({_embedded: {containers: makeContainers()}});
  });

  stubRequest("get", "/proxy/:containers", function(request) {
    assert.equal(request.queryParams.horizon, expectedHorizons.pop());
    return this.success(makeValidMetricData());
  });

  signInAndVisit(databaseMetricsUrl);
  andThen(() => {
    clickButton("1 day");
  });

  andThen(() => {
    assert.equal(expectedHorizons.length, 0, "Not enough requests!");
  });
});
