import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;

let settingsUrl = '/settings';
let settingsAccountUrl = `${settingsUrl}/admin`;
let settingsProfileUrl = `${settingsUrl}/profile`;
// from signInAndVisit helper
let userEmail = 'stubbed-user@gmail.com';

module('Acceptance: User Settings: Account', {
  beforeEach: function() {
    App = startApp();
    stubStacks();
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
    let currentPasswordInput = findInput('current-password');
    assert.ok(!currentPasswordInput.length, 'shows no current password input');

    clickButton('Change password');
  });

  andThen(function(){
    expectInput('current-password');
  });
});

test(`visit ${settingsAccountUrl} allows changing password`, function(assert) {
  assert.expect(5);

  signInAndVisit(settingsAccountUrl);

  var newPassword = 'abcdefghi',
      oldPassword = 'defghiljk';

  stubRequest('put', 'users/user1', function(request){
    var user = this.json(request);

    assert.equal(user.current_password, oldPassword);
    assert.equal(user.password, newPassword);

    return this.success({
      id: 'user1'
    });
  });

  andThen(function(){
    fillInput('password', newPassword);
    fillInput('confirm-password', newPassword);
    clickButton('Change password');
  });

  andThen(function(){
    fillInput('current-password', oldPassword);
    clickButton('Change password');
  });

  andThen(function(){
    let passwordInput = findInput('password');
    assert.ok(Ember.isBlank(passwordInput.val()), 'password input is empty');

    let confirmPasswordInput = findInput('confirm-password');
    assert.ok(Ember.isBlank(confirmPasswordInput.val()), 'confirm password input is empty');

    assert.ok(!findInput('current-password').length, 'current password input is not shown');
  });
});

test(`visit ${settingsAccountUrl} and change password with errors`, function(assert) {
  assert.expect(3);

  var newPassword = 'abcdefghi',
      oldPassword = 'defghiljk';

  stubRequest('put', 'users/user1', function(request){
    this.json(request);

    return this.error({
      code: 401,
      error: 'invalid_credentials',
      message: 'Invalid password'
    });
  });

  signInAndVisit(settingsAccountUrl);
  fillInput('password', newPassword);
  fillInput('confirm-password', newPassword);
  clickButton('Change password');
  fillInput('current-password', oldPassword);
  clickButton('Change password');

  andThen(function(){
    let error = find('.alert-danger');
    assert.ok(error.length, 'shows error');
    assert.ok(error.text().indexOf('Invalid password') > -1,
       'shows error message');
    click(error);
  });

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

    assert.ok(!findInput('current-password').length,
       'does not show current password input');

    expectButton('Change email');
    clickButton('Change email');
  });

  andThen(function(){
    expectInput('current-password');
    expectButton('Change email');
  });
});

test(`visit ${settingsAccountUrl} allows change email`, function(assert) {
  assert.expect(2);

  signInAndVisit(settingsAccountUrl);

  let newEmail = 'newEmail@example.com';
  let currentPassword = 'alkjsdf';

  stubRequest('put', '/users/user1', function(request){
    var user = this.json(request);

    assert.equal(user.email, newEmail);
    assert.equal(user.current_password, currentPassword);

    return this.success({
      id: 'user1',
      email: newEmail
    });
  });

  andThen(function(){
    fillInput('email', newEmail);
    clickButton('Change email');
  });

  andThen(function(){
    fillInput('current-password', currentPassword);
    clickButton('Change email');
  });
});

test(`visit ${settingsAccountUrl} change email and errors`, function(assert) {
  assert.expect(3);


  let newEmail = 'newEmail@example.com';
  let currentPassword = 'alkjsdf';

  stubRequest('put', '/users/user1', function(request){
    this.json(request);

    return this.error({
      code: 401,
      error: 'invalid_credentials',
      message: 'Invalid password'
    });
  });

  signInAndVisit(settingsAccountUrl);
  fillInput('email', newEmail);
  clickButton('Change email');
  fillInput('current-password', currentPassword);
  clickButton('Change email');

  andThen(function(){
    let error = find('.alert');
    assert.ok(error.length, 'shows error div');
    assert.ok(error.text().indexOf('Invalid password'), 'shows error message');
  });

  visit(settingsProfileUrl); // go away
  visit(settingsAccountUrl); // come back

  andThen( () => {
    let error = find('.alert');
    assert.ok(!error.length, 'error is no longer shown');
  });
});
