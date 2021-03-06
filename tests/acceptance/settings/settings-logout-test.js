import Ember from "ember";
import { module, test } from "qunit";
import startApp from "../../helpers/start-app";
import { stubRequest } from "../../helpers/fake-server";

let App;
const logoutUrl = "/settings/logout";

module("Acceptance: User Settings: Logout", {
  beforeEach() {
    App = startApp();
    stubStacks();
    stubOrganization({ id: '1'});
  },

  afterEach() {
    Ember.run(App, "destroy");
  }
});

test(`${logoutUrl} redirects anonymous users to /login`, function(assert) {
  assert.expect(1);

  visit(logoutUrl);

  andThen(() => {
    assert.equal(currentPath(), "login", "redirected to login");
  });
});

test(`${logoutUrl} shows logout button`, function(assert) {
  assert.expect(1);

  signInAndVisit(logoutUrl);

  andThen(() => {
    assert.ok(find("button:contains(Log Out)").length,
              "Log Out button is present");
  });
});

test(`${logoutUrl} allow a user to logout their current session`, function(assert) {
  assert.expect(2);

  let hasDeletedToken = false;

  stubOrganization();
  stubRequest("delete", "/tokens/stubbed-token-id", function() {
    hasDeletedToken = true;
    return this.success(204, {});
  });

  signInAndVisit(logoutUrl);

  andThen(() => {
    clickButton("Log Out");
  });

  andThen(() => {
    assert.ok(hasDeletedToken, "Token was deleted");
    expectReplacedLocation('/');
  });
});

test(`${logoutUrl} allow a user to logout all sessions`, function(assert) {
  assert.expect(2);

  let hasRevokedAllTokens = false;

  stubRequest("post", "/tokens/revoke_all_accessible", function() {
    hasRevokedAllTokens = true;
    return this.success(204, {});
  });

  signInAndVisit(logoutUrl);

  andThen(() => {
    check("revoke-all-accessible");
    clickButton("Log Out");
  });

  andThen(() => {
    assert.ok(hasRevokedAllTokens, "All tokens were revoked");
    expectReplacedLocation('/');
  });
});

test(`${logoutUrl} shows an error if one occurs`, function(assert) {
  assert.expect(1);

  stubOrganization();
  stubRequest("delete", "/tokens/stubbed-token-id", function() {
    return this.error(500, {
      code: 500,
      error: "internal_server_error",
      message: "Internal Server Error"
    });
  });

  signInAndVisit(logoutUrl);

  andThen(() => {
    clickButton("Log Out");
  });

  andThen(() => {
    assert.ok(find("div.alert:contains(Internal Server Error)").length);
  });
});

test(`${logoutUrl} ignores an expired_token error for regular logout`, function(assert) {
  assert.expect(1);

  stubOrganization();
  stubRequest("delete", "/tokens/stubbed-token-id", function() {
    return this.error(401, {
      code: 401,
      error: "expired_token",
      message: "Expired Token"
    });
  });

  signInAndVisit(logoutUrl);

  andThen(() => {
    clickButton("Log Out");
  });

  andThen(() => {
    expectReplacedLocation('/');
  });
});

test(`${logoutUrl} does not ignore an expired_token for a revoke logout`, function(assert) {
  assert.expect(1);

  stubOrganization();

  stubRequest("post", "/tokens/revoke_all_accessible", function() {
    return this.error(401, {
      code: 401,
      error: "expired_token",
      message: "Expired Token"
    });
  });

  signInAndVisit(logoutUrl);

  andThen(() => {
    check("revoke-all-accessible");
    clickButton("Log Out");
  });

  andThen(() => {
    assert.ok(find("div.alert:contains(Expired Token)").length);
  });
});
