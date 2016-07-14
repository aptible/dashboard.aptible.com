import Ember from "ember";
import { stubRequest } from "ember-cli-fake-server";
import {module, test} from "qunit";
import startApp from "../helpers/start-app";

let App;

module("Acceptance: Error Page", {
  beforeEach: function() {
    App = startApp();
    stubOrganization();
    stubOrganizations();
  },
  afterEach: function() {
    Ember.run(App, "destroy");
  }
});

const stubStacksWithError = function(code, error, message) {
  stubRequest("get", "/accounts", function() {
    return this.error(code, { code, error, message });
  });
};

[
  [404, "Not Found", "not_found", "Not Found"],
  [403, "Forbidden", "access_denied", "Access Denied"],
  [500, "Internal Server Error", "internal_server_error", "Internal Server Error"],
].forEach((testCase) => {
  const httpStatusCode = testCase[0];
  const httpStatusLine = testCase[1];
  const apiError = testCase[2];
  const apiMessage = testCase[3];

  test(`Getting a ${httpStatusCode} ${apiError} from the API shows error`, function(assert) {
    stubStacksWithError(httpStatusCode, apiError, apiMessage);
    signInAndVisit("/");

    andThen(() => {
      assert.equal(currentPath(), "error");
      expectLink("support.aptible.com");
      expectLink("contact.aptible.com");
      expectLink("status.aptible.com");
      expectLink("twitter.com/aptiblestatus");

      assert.ok(find(`a[href="/"]`).length, "Has link back to /");

      assert.ok(find(`h1:contains("${httpStatusCode}")`).length,
                `HTTP Status Code ${httpStatusCode} is shown in h1`);
      assert.ok(find(`h1:contains("${httpStatusLine}")`).length,
                `HTTP Status Line ${httpStatusLine} is shown in h3`);
      assert.ok(find(`h3:contains("${apiMessage}")`).length,
                `API Error message ${apiMessage} is shown in h3`);
    });
  });
});
