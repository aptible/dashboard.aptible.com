import Ember from "ember";
import { stubRequest } from "ember-cli-fake-server";
import {module, test} from "qunit";
import startApp from "../helpers/start-app";

let App;

module("Acceptance: No Stacks Page", {
  beforeEach: function() {
    App = startApp();
    stubOrganization();

    stubRequest("get", "/accounts", function() {
      return this.success({
        _embedded: {
          accounts: []
        }
      });
    });
  },
  afterEach: function() {
    Ember.run(App, "destroy");
  }
});

test("visiting / redirects to no stacks page", function(assert) {
  signInAndVisit("/");

  andThen(function() {
    assert.equal(currentPath(), "requires-authorization.enclave.no-stack");
    assert.equal(find("h1:contains(Your account doesn't have access to any environments)").length, 1, 'shows message');
    expectLink("support.aptible.com");
    expectLink("status.aptible.com");
  });
});
