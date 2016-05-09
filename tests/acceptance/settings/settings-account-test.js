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
let currentPassword = 'alkjsdf';
let newPassword = 'abcdefghi';
let otpToken = '123456';
let otpUri = `otpauth://totp/Aptible:${userEmail}?secret=abc123456&issuer=Aptible`;

let createStubUserEndpoint = function(assert, options) {
  // Options recognized:
  // - expectPasswordChange (defaults to false).
  // - expectEmailChange (defaults to false).
  // - expectNewOtpStatus (defaults to not expecting anything).
  // - expectOtpToken (defaults to false).
  // - acceptCredentials (defaults to false).
  // - errorMessage (defaults to 'Invalid credentials')

  stubRequest('put', 'users/user1', function(request){
    let params = this.json(request);

    assert.equal(params.current_password, currentPassword, 'correct current_password is passed');

    if (options.expectOtpToken) {
      if (!params.otp_token) {
        return this.error(401, {
          code: 401,
          error: 'otp_token_required',
          message: 'OTP Token Required'
        });
      }
      assert.equal(params.otp_token, otpToken, 'correct otp_token is passed');
    } else {
      assert.ok(!params.otp_token, 'No unexpected OTP token was passed');
    }

    if (options.expectEmailChange) {
      assert.equal(params.email, newEmail, 'correct email is passed');
      if (options.acceptCredentials) {
        return this.success({id: 'user1', email: newEmail});
      }
    }

    if (options.expectPasswordChange) {
      assert.equal(params.password, newPassword, 'correct password is passed');
      if (options.acceptCredentials) {
        return this.success({id: 'user1'});
      }
    }

    if (options.expectResetOtp) {
      assert.equal(params.otp_reset, true, 'OTP reset was passed');
      if (options.acceptCredentials) {
        return this.success({id: 'user1', otp_uri: otpUri});
      }
    }

    if (options.expectNewOtpStatus !== undefined) {
      assert.equal(params.otp_enabled, options.expectNewOtpStatus, `New OTP enabled was not ${options.expectNewOtpStatus}`);
      if (options.acceptCredentials) {
        return this.success({id: 'user1', otp_enabled: options.expectNewOtpStatus});
      }
    }

    return this.error(401, {
      code: 401,
      error: 'invalid_credentials',
      message: options.errorMessage || 'Invalid credentials'
    });
  });
};

let assertErrorShown =  function(assert, errorMessage) {
  andThen(function(){
    let error = find('.alert-danger');
    assert.ok(error.length, 'shows error');
    assert.ok(error.text().indexOf(errorMessage) > -1, `shows error message '${errorMessage}'`);
  });
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

test('visit ' + settingsAccountUrl + ' shows change password form', function(assert) {
  signInAndVisit(settingsAccountUrl);

  andThen(function(){
    // change password

    assert.ok(find('h3:contains(Change Your Password)').length,
       'has change password header' );

    expectInput('password');
    expectInput('confirm-password');
    expectButton('Change password');
    let currentPasswordInput = findInput('password-current-password');
    assert.ok(!currentPasswordInput.length, 'shows no current password input');

    clickButton('Change password');
  });

  andThen(function(){
    expectInput('password-current-password');
  });
});

test(`visit ${settingsAccountUrl} allows changing password`, function(assert) {
  assert.expect(7);

  createStubUserEndpoint(assert, {
    expectPasswordChange: true,
    acceptCredentials: true
  });

  signInAndVisit(settingsAccountUrl);

  andThen(function(){
    fillInput('password', newPassword);
    fillInput('confirm-password', newPassword);
    clickButton('Change password');
  });

  andThen(function(){
    fillInput('password-current-password', currentPassword);
    assert.ok(!findInput('password-otp-token').length, 'OTP token input is not shown');
    clickButton('Change password');
  });

  andThen(function(){
    let passwordInput = findInput('password');
    assert.ok(Ember.isBlank(passwordInput.val()), 'password input is empty');

    let confirmPasswordInput = findInput('confirm-password');
    assert.ok(Ember.isBlank(confirmPasswordInput.val()), 'confirm password input is empty');

    assert.ok(!findInput('password-current-password').length, 'current password input is not shown');
  });
});

test(`visit ${settingsAccountUrl} allows changing password (with 2FA)`, function(assert) {
  assert.expect(4);

  createStubUserEndpoint(assert, {
    expectPasswordChange: true,
    expectOtpToken: true,
    acceptCredentials: true
  });

  signInAndVisit(settingsAccountUrl, { otpEnabled: true });

  andThen(function(){
    fillInput('password', newPassword);
    fillInput('confirm-password', newPassword);
    clickButton('Change password');
  });

  andThen(function(){
    fillInput('password-current-password', currentPassword);
    fillInput('password-otp-token', otpToken);
    clickButton('Change password');
  });

  andThen(function(){
    assert.ok(!findInput('password-current-password').length, 'current password input is not shown');
  });
});

test(`visit ${settingsAccountUrl} and change password with errors`, function(assert) {
  assert.expect(6);

  let errorMessage = 'Invalid password';
  createStubUserEndpoint(assert, {
    expectPasswordChange: true,
    errorMessage: errorMessage
  });

  signInAndVisit(settingsAccountUrl);
  fillInput('password', newPassword);
  fillInput('confirm-password', newPassword);
  clickButton('Change password');
  fillInput('password-current-password', currentPassword);
  clickButton('Change password');

  assertErrorShown(assert, errorMessage);

  visit(settingsProfileUrl); // go away
  visit(settingsAccountUrl); // come back

  andThen( () => {
    let error = find('.alert');
    assert.ok(!error.length, 'error is not shown anymore');
  });
});

test(`visit ${settingsAccountUrl} shows change email form`, function(assert) {
  signInAndVisit(settingsAccountUrl);

  andThen(function(){
    // change email

    assert.ok( find('h3:contains(Change Your Email)').length,
        'has change email header' );

    expectInput('email');
    assert.equal(findInput('email').val(), userEmail,
          'email input has user email value');

    assert.ok(!findInput('email-current-password').length,
       'does not show current password input');

    expectButton('Change email');
    clickButton('Change email');
  });

  andThen(function(){
    expectInput('email-current-password');
    expectButton('Change email');
  });
});

test(`visit ${settingsAccountUrl} allows changing email`, function(assert) {
  assert.expect(5);

  createStubUserEndpoint(assert, {
    expectEmailChange: true,
    acceptCredentials: true
  });

  signInAndVisit(settingsAccountUrl);

  andThen(function(){
    fillInput('email', newEmail);
    clickButton('Change email');
  });

  andThen(function(){
    fillInput('email-current-password', currentPassword);
    assert.ok(!findInput('email-otp-token').length, 'OTP token input is not shown');
    clickButton('Change email');
  });

  andThen(function(){
    assert.ok(!findInput('email-current-password').length, 'current password input is not shown');
  });
});

test(`visit ${settingsAccountUrl} allows changing email (with 2FA)`, function(assert) {
  assert.expect(4);

  createStubUserEndpoint(assert, {
    expectEmailChange: true,
    acceptCredentials: true,
    expectOtpToken: true
  });

  signInAndVisit(settingsAccountUrl, { otpEnabled: true });

  andThen(function(){
    fillInput('email', newEmail);
    clickButton('Change email');
  });

  andThen(function(){
    fillInput('email-current-password', currentPassword);
    fillInput('email-otp-token', otpToken);
    clickButton('Change email');
  });

  andThen(function(){
    assert.ok(!findInput('email-current-password').length, 'current password input is not shown');
  });
});

test(`visit ${settingsAccountUrl} change email and errors`, function(assert) {
  assert.expect(6);

  let errorMessage = 'Invalid password';
  createStubUserEndpoint(assert, {
    expectEmailChange: true,
    errorMessage: errorMessage
  });

  signInAndVisit(settingsAccountUrl);
  fillInput('email', newEmail);
  clickButton('Change email');
  fillInput('email-current-password', currentPassword);
  clickButton('Change email');

  assertErrorShown(assert, errorMessage);

  visit(settingsProfileUrl); // go away
  visit(settingsAccountUrl); // come back

  andThen( () => {
    let error = find('.alert');
    assert.ok(!error.length, 'error is no longer shown');
  });
});

test(`${settingsAccountUrl} clears credentials when the user navigates away`, function(assert) {
  signInAndVisit(settingsAccountUrl);
  andThen(() => fillInput('otp-current-password', 'foobar123'));
  andThen(() => assert.equal(findInput('otp-current-password').val(), 'foobar123'));
  visit(settingsProfileUrl); // go away
  visit(settingsAccountUrl); // come back
  andThen(() => assert.equal(findInput('otp-current-password').val(), ''));
});

test(`${settingsAccountUrl} allows a user with 2FA disabled to reset it (good credentials)`, function(assert) {
  createStubUserEndpoint(assert, {
    expectResetOtp: true,
    acceptCredentials: true
  });

  signInAndVisit(settingsAccountUrl);
  fillInput('otp-current-password', currentPassword);

  clickButton('Start 2FA activation');
  andThen(() => {
    assert.ok(findInput('otp-otp-token').length, 'OTP token input is found');
    // TODO: Assert that a QR code is shown.
  });
});

test(`${settingsAccountUrl} allows a user with 2FA disabled to reset it (bad credentials)`, function(assert) {
  let errorMessage = 'Invalid OTP Token';
  createStubUserEndpoint(assert, {
    expectResetOtp: true,
    errorMessage: errorMessage
  });

  signInAndVisit(settingsAccountUrl);
  fillInput('otp-current-password', currentPassword);

  clickButton('Start 2FA activation');

  andThen(() => {
    assert.ok(!findInput('otp-otp-token').length, 'OTP token input is not found');
    let passwordInput = findInput('otp-current-password');
    assert.equal(passwordInput.val(), currentPassword, 'Current password is preserved');
  });
  assertErrorShown(assert, errorMessage);
});

test(`${settingsAccountUrl} allows a user with 2FA reset to enable it (good credentials)`, function(assert) {
  createStubUserEndpoint(assert, {
    expectNewOtpStatus: true,
    expectOtpToken: true,
    acceptCredentials: true
  });

  signInAndVisit(settingsAccountUrl, { otpUri: otpUri } );
  fillInput('otp-current-password', currentPassword);
  fillInput('otp-otp-token', otpToken);

  clickButton('Activate 2FA');

  andThen(() => {
    assert.equal(findInput('otp-current-password').val(), '', 'Current password prompt is empty');
    assert.equal(findInput('otp-otp-token').val(), '', 'OTP token input is empty');
  });
});

test(`${settingsAccountUrl} allows a user with 2FA reset to enable it (bad credentials)`, function(assert) {
  let errorMessage = 'Invalid OTP Token';
  createStubUserEndpoint(assert, {
    expectNewOtpStatus: true,
    expectOtpToken: true,
    errorMessage: errorMessage
  });

  signInAndVisit(settingsAccountUrl, { otpUri: otpUri } );
  fillInput('otp-current-password', currentPassword);
  fillInput('otp-otp-token', otpToken);

  clickButton('Activate 2FA');

  andThen(() => {
    let passwordInput = findInput('otp-current-password');
    assert.equal(passwordInput.val(), currentPassword, 'Current password input is preserved');
    let otpTokenInput = findInput('otp-otp-token');
    assert.equal(otpTokenInput.val(), otpToken, 'OTP token input is preserved');
  });
  assertErrorShown(assert, errorMessage);
});

test(`${settingsAccountUrl} allows a user with 2FA enabled to disable it (good credentials)`, function(assert) {
  createStubUserEndpoint(assert, {
    expectNewOtpStatus: false,
    expectOtpToken: true,
    acceptCredentials: true
  });

  signInAndVisit(settingsAccountUrl, { otpEnabled: true } );
  fillInput('otp-current-password', currentPassword);
  fillInput('otp-otp-token', otpToken);

  clickButton('Deactivate 2FA');

  andThen(() => {
    assert.equal(findInput('otp-current-password').val(), '', 'Current password prompt is empty');
    assert.ok(!findInput('otp-otp-token').length, 'OTP token input is not found');
  });
});

test(`${settingsAccountUrl} allows a user with 2FA enabled to disable it (bad credentials)`, function(assert) {
  let errorMessage = 'Invalid OTP Token';
  createStubUserEndpoint(assert, {
    expectNewOtpStatus: false,
    expectOtpToken: true,
    acceptCredentials: false,
    errorMessage: errorMessage
  });

  signInAndVisit(settingsAccountUrl, { otpEnabled: true } );
  fillInput('otp-current-password', currentPassword);
  fillInput('otp-otp-token', otpToken);

  clickButton('Deactivate 2FA');

  andThen(() => {
    let passwordInput = findInput('otp-current-password');
    assert.equal(passwordInput.val(), currentPassword, 'Current password input is preserved');
    let otpTokenInput = findInput('otp-otp-token');
    assert.equal(otpTokenInput.val(), otpToken, 'OTP token input is preserved');
  });

  assertErrorShown(assert, errorMessage);
});
