import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;

let settingsUrl = '/settings';
let settingsAccountUrl = `${settingsUrl}/admin`;
let settingsProfileUrl = `${settingsUrl}/profile`;
let userId = 'user1'; // from signInAndVisit helper
let userEmail = 'stubbed-user@gmail.com'; // from signInAndVisit helper
let userName = 'stubbed user'; // from signInAndVisit helper

let userApiUrl = '/users/' + userId;

module('Acceptance: User Settings: Account', {
  setup: function() {
    App = startApp();
    stubStacks();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test(settingsAccountUrl + ' requires authentication', function(){
  expectRequiresAuthentication(settingsAccountUrl);
});

test('visit ' + settingsAccountUrl + ' shows change password form', function(){
  signInAndVisit(settingsAccountUrl);

  andThen(function(){
    // change password

    ok(find('h3:contains(Change Your Password)').length,
       'has change password header' );

    expectInput('password');
    expectInput('confirm-password');
    expectButton('Change password');
    let currentPasswordInput = findInput('current-password');
    ok(!currentPasswordInput.length, 'shows no current password input');

    clickButton('Change password');
  });

  andThen(function(){
    expectInput('current-password');
  });
});

test(`visit ${settingsAccountUrl} allows changing password`, function(){
  expect(5);

  signInAndVisit(settingsAccountUrl);

  var newPassword = 'abcdefghi',
      oldPassword = 'defghiljk';

  stubRequest('put', 'users/user1', function(request){
    var user = this.json(request);

    equal(user.current_password, oldPassword);
    equal(user.password, newPassword);

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
    ok(Ember.isBlank(passwordInput.val()), 'password input is empty');

    let confirmPasswordInput = findInput('confirm-password');
    ok(Ember.isBlank(confirmPasswordInput.val()), 'confirm password input is empty');

    ok(!findInput('current-password').length, 'current password input is not shown');
  });
});

test(`visit ${settingsAccountUrl} and change password with errors`, function(){
  expect(3);


  var newPassword = 'abcdefghi',
      oldPassword = 'defghiljk';

  stubRequest('put', 'users/user1', function(request){
    var user = this.json(request);

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
    let error = find('.alert');
    ok(error.length, 'shows error');
    ok(error.text().indexOf('Invalid password') > -1,
       'shows error message');
  });

  visit(settingsProfileUrl); // go away
  visit(settingsAccountUrl); // come back

  andThen( () => {
    let error = find('.alert');
    ok(!error.length, 'error is not shown anymore');
  });
});

test(`visit ${settingsAccountUrl} shows change email form`, function(){
  signInAndVisit(settingsAccountUrl);

  andThen(function(){
    // change email

    ok( find('h3:contains(Change Your Email)').length,
        'has change email header' );

    expectInput('email');
    equal(findInput('email').val(), userEmail,
          'email input has user email value');

    ok(!findInput('current-password').length,
       'does not show current password input');

    expectButton('Change email');
    clickButton('Change email');
  });

  andThen(function(){
    expectInput('current-password');
    expectButton('Change email');
  });
});

test(`visit ${settingsAccountUrl} allows change email`, function(){
  expect(2);

  signInAndVisit(settingsAccountUrl);

  let newEmail = 'newEmail@example.com';
  let currentPassword = 'alkjsdf';

  stubRequest('put', '/users/user1', function(request){
    var user = this.json(request);

    equal(user.email, newEmail);
    equal(user.current_password, currentPassword);

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

test(`visit ${settingsAccountUrl} change email and errors`, function(){
  expect(3);


  let newEmail = 'newEmail@example.com';
  let currentPassword = 'alkjsdf';

  stubRequest('put', '/users/user1', function(request){
    var user = this.json(request);

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
    ok(error.length, 'shows error div');
    ok(error.text().indexOf('Invalid password'), 'shows error message');
  });

  visit(settingsProfileUrl); // go away
  visit(settingsAccountUrl); // come back

  andThen( () => {
    let error = find('.alert');
    ok(!error.length, 'error is no longer shown');
  });
});
