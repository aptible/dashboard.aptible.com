import Ember from "ember";
import {module, test} from "qunit";
import startApp from "../../helpers/start-app";
import { stubRequest } from "../../helpers/fake-server";

let App;

let appId = "1",
    serviceId = "2",
    releaseId = "3",
    appHandle = "my-app-handle",
    stackHandle = "my-stack-handle",
    stackId = "my-stack-id";

let appUrl = `/apps/${appId}`,
    appServicesUrl = `${appUrl}/services`,
    serviceMetricsUrl = `${appServicesUrl}/${serviceId}/metrics`;

function makeContainers() {
  return [
  {
    id: 1,
    docker_name: "a1a1a1a1a1a1a1a1a1a1a1",
    layer: "proxy"
  },
  {
    id: 2,
    docker_name: "a2a2a2a2a2a2a2a2a2a2a2",
    layer: "logging"
  },
  {
    id: 3,
    docker_name: "a3a3a3a3a3a3a3a3a3a3a3",
    layer: "app"
  },
  {
    id: 4,
    docker_name: "b1",
    layer: "proxy"
  },
  {
    id: 5,
    docker_name: "b2",
    layer: "logging"
  },
  {
    id: 6,
    docker_name: "b3b3b3b3b3b3b3b3b3b3b3",
    layer: "app"
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
  handle: "hubot",
  command: "bin/exec hubot",
  _links: {
    current_release: {
      href: `/releases/${releaseId}`
    }
  }
};

let app = {
  id: appId,
  handle: appHandle,
  _embedded: { services: [service] },
  _links: { account: { href: `/accounts/${stackId}` } }
};

function makeValidMetricData() {
  return {
    x: "x",
    columns: [
      ["x", 1, 2, 3, 4, 5, 6],
      ["a3a3a3a3a3a3a3a3a3a3a3", 1, 2, 3, 4],
      ["b3b3b3b3b3b3b3b3b3b3b3", 1, 2, 3, 4],
    ]
  };
}


module("Acceptance: App Service Metrics", {
  beforeEach: function() {
    App = startApp();
    stubStacks();
    stubOrganizations();
    stubStack(stack);
    stubApp(app);
    stubRequest("get", `/releases/${releaseId}`, function() {
      return this.success(release);
    });
  },
  afterEach: function() {
    Ember.run(App, "destroy");
  }
});

test("it passes app container IDs, with default horizon and auth token; shows graph", function(assert) {
  stubRequest("get", `/releases/${releaseId}/containers`, function() {
    return this.success({_embedded: {containers: makeContainers()}});
  });

  stubRequest("get", "/dev/proxy/:containers", function(request) {
    assert.equal(request.params.containers, "a3a3a3a3a3a3a3a3a3a3a3:b3b3b3b3b3b3b3b3b3b3b3");
    assert.equal(request.queryParams.horizon, "1h");
    assert.equal(request.requestHeaders["Authorization"], "Bearer my-token");
    return this.success(makeValidMetricData());
  });

  signInAndVisit(serviceMetricsUrl);

  andThen(() => {
    // Check that we don't show the memory limit since none is set
    assert.equal(find("#show-memory-limit").length, 0, "Show memory limit button is shown!");

    // Check that we rendered the chart
    let chart = findWithAssert("div.c3-chart-component");
    assert.ok(chart.text().indexOf("Memory usage") > -1, "Memory usage label is not shown!");
    assert.ok(chart.text().indexOf("a3a3a3a3a3a3a3a3a3a3a3") > -1, "Container A3 is missing");
    assert.ok(chart.text().indexOf("b3b3b3b3b3b3b3b3b3b3b3") > -1, "Container B3 is missing");
    assert.ok(chart.text().indexOf("a1a1a1a1a1a1a1a1a1a1a1") === -1, "Container A1 is present");
  });
});

test("it reloads and redraws data when reload is clicked", function(assert) {
  stubRequest("get", `/releases/${releaseId}/containers`, function() {
    return this.success({_embedded: {containers: makeContainers()}});
  });

  let metricResponses = [makeValidMetricData(), makeValidMetricData()];
  metricResponses[0].columns[1].push(99999);

  stubRequest("get", "/dev/proxy/:containers", function() {
    return this.success(metricResponses.pop());
  });

  signInAndVisit(serviceMetricsUrl);

  andThen(() => {
    clickButton("Reload");
  });

  andThen(() => {
    assert.equal(metricResponses.length, 0, "Not enough requests!");
    let chart = findWithAssert("div.c3-chart-component");
    // Expect the chart to resize to show the new data point
    assert.ok(chart.text().indexOf("100000 MB") > -1, "Memory not shown!");
  });
});

test("it shows memory limit checkbox and memory limit line if limit exists", function (assert) {
  stubRequest("get", `/releases/${releaseId}/containers`, function() {
    let containers = makeContainers();
    containers[2].memory_limit = 99999;
    return this.success({_embedded: {containers: containers}});
  });

  stubRequest("get", "/dev/proxy/:containers", function() {
    return this.success(makeValidMetricData());
  });

  signInAndVisit(serviceMetricsUrl);

  andThen(() => {
    check("show-memory-limit");
  });

  andThen(() => {
    // Check that we don't show the memory limit since none is set
    assert.equal(find("#show-memory-limit").length, 1, "Show memory limit button is not shown!");

    let chart = findWithAssert("div.c3-chart-component");
    assert.ok(chart.text().indexOf("Memory limit (99999 MB)") > -1, "Memory limit not shown!");
    assert.ok(chart.text().indexOf("100000 MB") > -1, "Chart did not resize!");
  });
});

test("it can change the horizon", function (assert) {
  let expectedHorizons = ["1d", "1h"];

  stubRequest("get", `/releases/${releaseId}/containers`, function() {
    return this.success({_embedded: {containers: makeContainers()}});
  });

  stubRequest("get", "/dev/proxy/:containers", function(request) {
    assert.equal(request.queryParams.horizon, expectedHorizons.pop());
    return this.success(makeValidMetricData());
  });

  signInAndVisit(serviceMetricsUrl);
  andThen(() => {
    clickButton("1 day");
  });

  andThen(() => {
    assert.equal(expectedHorizons.length, 0, "Not enough requests!");
  });
});
