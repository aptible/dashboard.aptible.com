import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App, showedOtpUri;

let settingsUrl = '/settings';
let settingsAccountUrl = `${settingsUrl}/protected/admin`;
let settingsProfileUrl = `${settingsUrl}/profile`;
// from signInAndVisit helper
let userEmail = 'stubbed-user@gmail.com';

let newEmail = 'newEmail@example.com';
let newPassword = 'abcdefghi';
let otpToken = '123456';
let userId = "user1";
let otpConfigurationId = "otp123";
let otpConfigurationHref = `/otp_configurations/${otpConfigurationId}`;
let otpRecoveryCodesHref = `${otpConfigurationHref}/otp_recovery_codes`;

let createStubUserUpdateEndpoint = function(assert, options) {
  let defaultOptions = {
    expectPassword: undefined,
    expectEmail: undefined,
    expectOtpStatus: undefined,
    expectOtpToken: undefined,
    expectOtpConfiguration: undefined,
    returnError: true,
    errorMessage: "Invalid Credentials"
  };
  options = Ember.$.extend(true, defaultOptions, options);

  stubRequest('put', `/users/${userId}`, function(request){
    let params = this.json(request);

    if (options.expectEmail !== undefined) {
      assert.equal(params.email, options.expectEmail, 'correct email is passed');
    }

    if (options.expectPassword !== undefined) {
      assert.equal(params.password, options.expectPassword, 'correct password is passed');
    }

    if (options.expectOtpStatus !== undefined) {
      assert.equal(params.otp_enabled, options.expectOtpStatus, "correct OTP status is passed");
    }

    if (options.expectOtpToken !== undefined) {
      assert.equal(params.otp_token, options.expectOtpToken, "correct OTP token is passed");
    }

    if (options.expectOtpConfiguration !== undefined) {
        assert.equal(params.current_otp_configuration, options.expectOtpConfiguration, "Correct OTP Configuration is passed");
    }

    if (options.returnError) {
      return this.error(401, {
        code: 401,
        error: 'some_error',
        message: options.errorMessage || 'Invalid credentials'
      });
    }

    return this.success(Ember.$.extend(true, { id: userId }, params));
  });
};

let assertErrorShown =  function(assert, errorMessage) {
  andThen(function(){
    let error = find('.alert-danger');
    assert.ok(error.length, 'shows error');
    assert.ok(error.text().indexOf(errorMessage) > -1, `shows error message '${errorMessage}'`);
  });
};

let createStubOtpRecoveryCode = function(code, used) {
  let id = `code-${code}`;

  return {
    "_links": {
      "otp_configuration": {
        "href": otpConfigurationHref
      },
      "self": {
        "href":  `/otp_recovery_codes/${code}`
      }
    },
    _type: "otp_recovery_code",
    id: id,
    used: !!used,
    value: code
  };
};

let createStubOtpConfiguration = function() {
  let otpConfiguration = {
    _links: {
      otp_recovery_codes: {
        href: otpRecoveryCodesHref
      },
      self: {
        href: otpConfigurationHref
      },
      user: {
        href: `/users/${userId}`
      }
    },
    _type: "otp_configuration",
    id: otpConfigurationId,
  };

  if (!showedOtpUri) {
    // Only let users see the OTP URI once (which is what the API would do).
    otpConfiguration.otpUri = `otpauth://totp/Aptible:${userEmail}?secret=abc123456&issuer=Aptible`;
  }

  return otpConfiguration;
};

let setupOtpScaffolding = function(otpEnabled) {
  stubRequest("get", otpConfigurationHref, function() {
    // Allow one request where we show the OTP URI, which allows us to split our tests
    // for initializing 2FA and actually enabling it.
    return this.success(createStubOtpConfiguration());
  });

  stubRequest("get", otpRecoveryCodesHref, function() {
    return this.success({
      _embedded: {
        otp_recovery_codes: [ createStubOtpRecoveryCode('12345678', true), createStubOtpRecoveryCode('87654321', false) ],
        _links: {
          otp_configuration: { href: otpConfigurationHref },
          self: { href: otpRecoveryCodesHref }
        }
      }
    });
  });

  signInAndVisit(settingsAccountUrl, {
    otp_enabled: !!otpEnabled,
    _links: {
      current_otp_configuration: { href: otpConfigurationHref }
    }
  }, {}, { scope: "elevated" });
};

module('Acceptance: User Settings: Account', {
  beforeEach: function() {
    window.confirm = function() { return false; };
    App = startApp();
    showedOtpUri = false;
    stubStacks();
    stubOrganizations();
    stubOrganization({ id: 'o1'});
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test(settingsAccountUrl + ' requires authentication', function() {
  expectRequiresAuthentication(settingsAccountUrl);
});

test(settingsAccountUrl + ' requires elevation', function() {
  signIn({}, {}, { scope: "manage" });
  expectRequiresElevation(settingsAccountUrl);
});


test(`visit ${settingsAccountUrl} allows changing password`, function(assert) {
  assert.expect(4);

  createStubUserUpdateEndpoint(assert, {
    expectPassword: newPassword,
    returnError: false
  });

  signInAndVisit(settingsAccountUrl, {}, {}, { scope: "elevated" });

  andThen(function(){
    assert.ok(find('h3:contains(Change Your Password)').length, 'has change password header');
    fillInput('password', newPassword);
    fillInput('confirm-password', newPassword);
    clickButton('Change Password');
  });

  andThen(function(){
    let passwordInput = findInput('password');
    assert.ok(Ember.isBlank(passwordInput.val()), 'password input is empty');

    let confirmPasswordInput = findInput('confirm-password');
    assert.ok(Ember.isBlank(confirmPasswordInput.val()), 'confirm password input is empty');
  });
});

test(`visit ${settingsAccountUrl} and change password with errors`, function(assert) {
  assert.expect(2);

  let errorMessage = 'Some error';

  createStubUserUpdateEndpoint(assert, {
    returnError: true,
    errorMessage: errorMessage
  });

  signInAndVisit(settingsAccountUrl, {}, {}, { scope: "elevated" });

  andThen(() => {
    fillInput('password', newPassword);
    fillInput('confirm-password', newPassword);
    clickButton('Change Password');
  });

  andThen(() => {
    assertErrorShown(assert, errorMessage);
  });
});

test(`visit ${settingsAccountUrl} requires passwords to match`, function(assert) {
  assert.expect(2);

  signInAndVisit(settingsAccountUrl, {}, {}, { scope: "elevated" });

  andThen(() => {
    fillInput('password', newPassword);
    fillInput('confirm-password', newPassword + "junk");
    clickButton('Change Password');
  });

  andThen(() => {
    assertErrorShown(assert, "Passwords don't match");
  });
});

test(`visit ${settingsAccountUrl} allows changing email`, function(assert) {
  assert.expect(2);

  createStubUserUpdateEndpoint(assert, {
    expectEmail: newEmail,
    returnError: false
  });

  signInAndVisit(settingsAccountUrl, {}, {}, { scope: "elevated" });

  andThen(function(){
    fillInput('email', newEmail);
    clickButton('Change Email');
  });

  andThen(() => {
    let emailInput = findInput('email');
    assert.equal(emailInput.val(), newEmail, 'New email is shown');
  });
});


test(`visit ${settingsAccountUrl} change email with errors`, function(assert) {
  assert.expect(2);

  let errorMessage = 'Some error';

  createStubUserUpdateEndpoint(assert, {
    returnError: true,
    errorMessage: errorMessage
  });

  signInAndVisit(settingsAccountUrl, {}, {}, { scope: "elevated" });

  andThen(() => {
    fillInput('email', newEmail);
    clickButton('Change Email');
  });

  andThen(() => {
    assertErrorShown(assert, errorMessage);
  });
});

test(`${settingsAccountUrl} allows a user with 2FA disabled to reset it`, function(assert) {
  assert.expect(3);
  let createdOtpConfiguration = false;

  stubRequest("post", "/users/user1/otp_configurations", function() {
    createdOtpConfiguration = true;
    return this.success(createStubOtpConfiguration());
  });

  signInAndVisit(settingsAccountUrl, {}, {}, { scope: "elevated" });

  andThen(() => {
    clickButton('Configure 2FA');
  });

  andThen(() => {
    assert.ok(createdOtpConfiguration);
    assert.ok(findInput('otp-token').length, 'OTP token input is found');
    assert.ok(!find('h3:contains(Backup Codes)').length, 'recovery codes are not shown');
    // TODO: Find a way to assert that a QR code is shown?
  });
});

test(`${settingsAccountUrl} allows a user with 2FA reset to enable it (with OTP token)`, function(assert) {
  assert.expect(5);

  setupOtpScaffolding(false);

  createStubUserUpdateEndpoint(assert, {
    returnError: false,
    expectOtpStatus: true,
    expectOtpToken: otpToken,
    expectOtpConfiguration: otpConfigurationHref
  });

  andThen(() => {
    fillInput('otp-token', otpToken);
    clickButton('Enable 2FA');
  });

  andThen(() => {
    assert.ok(find('p:contains(2-factor authentication is enabled)').length, 'has 2FA enabled blurb');
    assert.ok(find('h3:contains(Backup Codes)').length, 'has recovery codes header');
  });
});

test(`${settingsAccountUrl} allows a user to reveal their OTP secret`, function(assert) {
  assert.expect(1);

  setupOtpScaffolding(false);

  andThen(() => {
    clickButton('reveal your 2FA secret');
  });

  andThen(() => {
    assert.ok(find('b:contains(abc123456)').length, 'shows OTP secret');
  });
});

test(`${settingsAccountUrl} allows a user with 2FA enabled to view their recovery codes`, function(assert) {
  assert.expect(4);

  setupOtpScaffolding(true);

  andThen(() => {
    assert.ok(find('h3:contains(Backup Codes)').length, 'has recovery codes header');
    assert.ok(!find('li:contains(12345678)').length, 'recovery codes are not shown');
    clickButton('Show Backup Codes');
  });

  andThen(() => {
    assert.ok(find('s:contains(12345678)').length, 'recovery codes are shown, and used codes are struck-through');
    assert.ok(find('li:contains(87654321)').length, 'recovery codes are shown');
  });
});

test(`${settingsAccountUrl} allows a user with 2FA enabled to disable it`, function(assert) {
  assert.expect(3);

  setupOtpScaffolding(true);

  createStubUserUpdateEndpoint(assert, {
    returnError: false,
    expectOtpStatus: false
  });

  andThen(() => {
    clickButton('Disable 2FA');
  });

  andThen(() => {
    assert.ok(!find('h3:contains(Backup Codes)').length, 'has no recovery codes header');
    assert.ok(find('p:contains(2-factor authentication can be enabled)').length, 'has 2FA disabled blurb');
  });
});

test(`On ${settingsAccountUrl}, saving your password should not interrupt the OTP process`, function(assert) {
  createStubUserUpdateEndpoint(assert, {
    expectPassword: newPassword,
    returnError: false
  });

  stubRequest("post", "/users/user1/otp_configurations", function() {
    return this.success(createStubOtpConfiguration());
  });

  signInAndVisit(settingsAccountUrl, {}, {}, { scope: "elevated" });

  andThen(() => {
    clickButton('Configure 2FA');
  });

  andThen(() => {
    assert.ok(findInput('otp-token').length, 'OTP token input is found');
  });

  andThen(() => {
    fillInput('password', newPassword);
    fillInput('confirm-password', newPassword);
    clickButton('Change Password');
  });

  andThen(() => {
    assert.ok(findInput('otp-token').length, 'OTP token input is still found');
  });
});

test(`On ${settingsAccountUrl}, saving your email should not update your password`, function(assert) {
  assert.expect(2);

  createStubUserUpdateEndpoint(assert, {
    expectEmail: newEmail,
    expectPassword: null
  });

  signInAndVisit(settingsAccountUrl, {}, {}, { scope: "elevated" });

  andThen(() => {
    fillInput("email", newEmail);
    fillInput("password", newPassword);
    clickButton("Change Email");
  });
});

test(`On ${settingsAccountUrl}, updating your email prompts to reset tokens`, function(assert) {
  assert.expect(2);
  window.confirm = function() { return true; };
  let revokeCalled = false;

  stubRequest('post', '/tokens/revoke_all_accessible', function() {
    revokeCalled = true;
    return this.success({revoked: 1});
  });

  createStubUserUpdateEndpoint(assert, { expectEmail: newEmail, returnError: false });
  signInAndVisit(settingsAccountUrl, {}, {}, { scope: "elevated" });

  andThen(() => {
    fillInput("email", newEmail);
    clickButton("Change Email");
  });

  andThen(() => {
    assert.ok(revokeCalled, 'Revoke should be called');
  });
});

test(`On ${settingsAccountUrl}, updating your password prompts to reset tokens`, function(assert) {
  assert.expect(2);
  window.confirm = function() { return true; };
  let revokeCalled = false;

  stubRequest('post', '/tokens/revoke_all_accessible', function() {
    revokeCalled = true;
    return this.success({revoked: 1});
  });

  createStubUserUpdateEndpoint(assert, { expectPassword: newPassword, returnError: false });
  signInAndVisit(settingsAccountUrl, {}, {}, { scope: "elevated" });

  andThen(() => {
    fillInput("password", newPassword);
    fillInput('confirm-password', newPassword);
    clickButton("Change Password");
  });

  andThen(() => {
    assert.ok(revokeCalled, 'Revoke should be called');
  });
});

test(`On ${settingsAccountUrl}, enabling 2FA prompts to reset tokens`, function(assert) {
  assert.expect(4);
  window.confirm = function() { return true; };
  let revokeCalled = false;

  stubRequest('post', '/tokens/revoke_all_accessible', function() {
    revokeCalled = true;
    return this.success({revoked: 1});
  });

  setupOtpScaffolding(false);
  createStubUserUpdateEndpoint(assert, {
    returnError: false,
    expectOtpStatus: true,
    expectOtpToken: otpToken,
    expectOtpConfiguration: otpConfigurationHref
  });

  andThen(() => {
    fillInput('otp-token', otpToken);
    clickButton('Enable 2FA');
  });

  andThen(() => {
    assert.ok(revokeCalled, 'Revoke should be called');
  });
});

test(`On ${settingsAccountUrl}, disabling 2FA does not prompt to reset tokens`, function(assert) {
  assert.expect(2);
  window.confirm = function() { return true; };
  let revokeCalled = false;

  stubRequest('post', '/tokens/revoke_all_accessible', function() {
    revokeCalled = true;
    return this.success({revoked: 1});
  });

  setupOtpScaffolding(true);
  createStubUserUpdateEndpoint(assert, {
    returnError: false,
    expectOtpStatus: false
  });

  andThen(() => {
    clickButton('Disable 2FA');
  });

  andThen(() => {
    assert.ok(!revokeCalled, 'Revoke should not be called');
  });
});

test(`${settingsAccountUrl} clears credentials when the user navigates away`, function(assert) {
  let user = createStubUser();
  stubUser(user);
  stubRequest('get', '/current_token', function() {
    return this.success(createStubToken({ scope: "elevated" }, user));
  });
  stubRequest("post", "/users/user1/otp_configurations", function() {
    return this.success(createStubOtpConfiguration());
  });
  setupOtpScaffolding(false);

  andThen(() => {
    fillInput('password', newPassword);
    fillInput('otp-token', otpToken);
  });

  visit(settingsProfileUrl); // go away
  visit(settingsAccountUrl); // come back

  andThen(() => {
    assert.equal(findInput('password').val(), '', 'password input is empty');
    assert.ok(!findInput('otp-token').length, 'OTP token input is no longer found');
    clickButton('Configure 2FA');
  });

  andThen(() => {
    assert.ok(findInput('otp-token').length, 'OTP token input is found again');
    assert.equal(findInput('otp-token').val(), '', 'OTP token input is empty');
  });
});

test(`${settingsAccountUrl} does not persist the 2FA params after activation`, function(assert) {
  assert.expect(3);

  setupOtpScaffolding(false);
  stubRequest("post", "/users/user1/otp_configurations", function() {
    return this.success(createStubOtpConfiguration());
  });
  createStubUserUpdateEndpoint(assert, { returnError: false });

  andThen(() => {
    findWithAssert("a:contains(reveal your 2FA secret)").click();
    fillInput('otp-token', otpToken);
    clickButton('Enable 2FA');
  });

  andThen(() => {
    clickButton('Show Backup Codes');
    clickButton('Disable 2FA');
  });

  andThen(()  => {
    clickButton('Configure 2FA');
  });

  andThen(() => {
    assert.ok(find("a:contains(reveal your 2FA secret)").length, 'Reveal OTP secret link is shown');
    assert.equal(findInput('otp-token').val(), '', 'OTP token input is empty');
    clickButton('Enable 2FA');
  });

  andThen(() => {
    assert.ok(!find('li:contains(12345678)').length, 'recovery codes are not shown');
  });
});

test(`${settingsAccountUrl} allows clearing all tokens`, function(assert) {
  // We want to ensure we'll show two tokens, so we'll change the output of /current_token
  // after logging.
  assert.expect(3);

  stubRequest('post', '/tokens/revoke_all_accessible', function(request) {
    const params = this.json(request);
    assert.equal(2, params.except_tokens.length);
    assert.equal('/tokens/manage-token', params.except_tokens[0]);
    assert.equal('/tokens/elevated-token', params.except_tokens[1]);
    return this.success({revoked: 4});
  });

  signInAndVisit(settingsAccountUrl, {}, {}, { scope: 'elevated', id: 'elevated-token' });

  andThen(() => {
    signIn({}, {}, { scope: 'manage', id: 'manage-token' });
  });

  andThen(() => {
    clickButton('Log Out All Other Sessions');
  });
});
