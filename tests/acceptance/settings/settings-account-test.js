import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;

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

let createStubOtpConfiguration = function(withOtpUri) {
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

  if (withOtpUri) {
    otpConfiguration.otpUri = `otpauth://totp/Aptible:${userEmail}?secret=abc123456&issuer=Aptible`;
  }

  return otpConfiguration;
};

let setupOtpScaffolding = function(otpEnabled) {
  // Preload the OTP configuration in the store.
  Ember.run(() => {
    let store = App.__container__.lookup("store:application");
    store.pushPayload({"otp_configurations": [createStubOtpConfiguration(true)]});
  });

  stubRequest("get", otpConfigurationHref, function() {
    // Allow requests to the OTP configuration, but don't return the OTP URI
    // (which is what the API would do).
    return this.success(createStubOtpConfiguration(false));
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
    otpEnabled: !!otpEnabled,  // NOTE: The helper expects name that work in Ember, not names as they are in the API :(
    _links: {
      current_otp_configuration: { href: otpConfigurationHref }
    }
  }, {}, { scope: "elevated" });
};

module('Acceptance: User Settings: Account', {
  beforeEach: function() {
    App = startApp();
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
    clickButton('Change password');
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
    clickButton('Change password');
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
    clickButton('Change password');
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
    clickButton('Change email');
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
    clickButton('Change email');
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
    return this.success(createStubOtpConfiguration(true));
  });

  signInAndVisit(settingsAccountUrl, {}, {}, { scope: "elevated" });

  andThen(() => {
    clickButton('Start 2FA activation');
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

test(`${settingsAccountUrl} allows a user with 2FA enabled to view their recovery codes`, function(assert) {
  assert.expect(4);

  setupOtpScaffolding(true);

  andThen(() => {
    assert.ok(find('h3:contains(Backup Codes)').length, 'has recovery codes header');
    assert.ok(!find('li:contains(12345678)').length, 'recovery codes are not shown');
    clickButton('Show backup codes');
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
    return this.success(createStubOtpConfiguration(true));
  });

  signInAndVisit(settingsAccountUrl, {}, {}, { scope: "elevated" });

  andThen(() => {
    clickButton('Start 2FA activation');
  });

  andThen(() => {
    assert.ok(findInput('otp-token').length, 'OTP token input is found');
  });

  andThen(() => {
    fillInput('password', newPassword);
    fillInput('confirm-password', newPassword);
    clickButton('Change password');
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
    clickButton("Change email");
  });
});

test(`${settingsAccountUrl} clears credentials when the user navigates away`, function(assert) {
  let user = createStubUser();
  stubUser(user);
  stubRequest('get', '/current_token', function() {
    return this.success(createStubToken({ scope: "elevated" }, user));
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
  });
});
