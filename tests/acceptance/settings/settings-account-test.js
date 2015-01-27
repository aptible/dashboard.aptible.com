import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

var settingsUrl = '/settings';
var settingsAccountUrl = settingsUrl + '/admin';
var userId = 'user1'; // from signInAndVisit helper
var userEmail = 'stubbed-user@gmail.com'; // from signInAndVisit helper
var userName = 'stubbed user'; // from signInAndVisit helper

var userApiUrl = '/users/' + userId;

module('Acceptance: User Settings: Account', {
  setup: function() {
    App = startApp();
    stubStacks();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

// Helper methods

function emailInput(){
  return find('input[name="email"]');
}

function changeEmailButton(){
  return find('button:contains(Change email)');
}

function passwordInput(){
  return find('input[name="password"]');
}

function confirmPasswordInput(){
  return find('input[name="confirm-password"]');
}

function currentPasswordInput(){
  return find('input[name="current-password"]');
}

function changePasswordButton(){
  return find('button:contains(Change password)');
}

test(settingsAccountUrl + ' requires authentication', function(){
  expectRequiresAuthentication(settingsAccountUrl);
});

test('visit ' + settingsAccountUrl + ' shows change password form', function(){
  signInAndVisit(settingsAccountUrl);

  andThen(function(){
    // change password

    ok(find('h3:contains(Change Your Password)').length,
       'has change password header' );

    ok(passwordInput().length, 'has password input');
    ok(confirmPasswordInput().length, 'has confirm password input');
    ok(changePasswordButton().length, 'has change password button');
    ok(!currentPasswordInput().length, 'shows no current password input');
    click(changePasswordButton());
  });

  andThen(function(){
    ok( currentPasswordInput().length, 'shows current password input');
  });
});

test('visit ' + settingsAccountUrl + ' allows changing password', function(){
  expect(5);

  signInAndVisit(settingsAccountUrl);

  var newPassword = 'abcdefghi',
      oldPassword = 'defghiljk';

  stubRequest('put', 'users/user1', function(request){
    var user = JSON.parse(request.requestBody);

    equal(user.current_password, oldPassword);
    equal(user.password, newPassword);

    return this.success({
      id: 'user1'
    });
  });

  andThen(function(){
    fillIn(passwordInput(), newPassword );
    fillIn(confirmPasswordInput(), newPassword );
    click(changePasswordButton());
  });

  andThen(function(){
    fillIn(currentPasswordInput(), oldPassword);
    click(changePasswordButton());
  });

  andThen(function(){
    ok(Ember.isBlank(passwordInput().val()), 'password input is empty');
    ok(Ember.isBlank(confirmPasswordInput().val()),
       'password confirm input is empty');
    ok(!currentPasswordInput().length, 'current password input is not shown');
  });
});

test('visit ' + settingsAccountUrl + ' and change password with errors', function(){
  expect(2);

  signInAndVisit(settingsAccountUrl);

  var newPassword = 'abcdefghi',
      oldPassword = 'defghiljk';

  stubRequest('put', 'users/user1', function(request){
    var user = JSON.parse(request.requestBody);

    return this.error({
      code: 401,
      error: 'invalid_credentials',
      message: 'Invalid password'
    });
  });

  andThen(function(){
    fillIn(passwordInput(), newPassword );
    fillIn(confirmPasswordInput(), newPassword );
    click(changePasswordButton());
  });

  andThen(function(){
    fillIn(currentPasswordInput(), oldPassword);
    click(changePasswordButton());
  });

  andThen(function(){
    var error = find('.alert');
    ok(error.length, 'shows error');
    ok(error.text().indexOf('Invalid password') > -1,
       'shows error message');
  });
});
test('visit ' + settingsAccountUrl + ' shows change email form', function(){
  signInAndVisit(settingsAccountUrl);

  andThen(function(){
    // change email

    ok( find('h3:contains(Change Your Email)').length,
        'has change email header' );

    ok( emailInput().length,
        'has email input');

    equal( emailInput().val(), userEmail,
           'email input has user email value');

    ok(!currentPasswordInput().length,
       'does not show current password input');

    ok( changeEmailButton().length, 'has change email button');
    click(changeEmailButton());
  });

  andThen(function(){
    ok(currentPasswordInput().length, 'shows current password input');
    ok(changeEmailButton().length, 'still shows change email button');
  });
});

test('visit ' + settingsAccountUrl + ' allows change email', function(){
  expect(2);

  signInAndVisit(settingsAccountUrl);

  var newEmail = 'newEmail@example.com';
  var currentPassword = 'alkjsdf';

  stubRequest('put', '/users/user1', function(request){
    var user = JSON.parse(request.requestBody);

    equal(user.email, newEmail);
    equal(user.current_password, currentPassword);

    return this.success({
      id: 'user1',
      email: newEmail
    });
  });

  andThen(function(){
    fillIn(emailInput(), newEmail);
    click(changeEmailButton());
  });

  andThen(function(){
    fillIn(currentPasswordInput(), currentPassword);
    click(changeEmailButton());
  });
});

test('visit ' + settingsAccountUrl + ' change email and errors', function(){
  expect(2);

  signInAndVisit(settingsAccountUrl);

  var newEmail = 'newEmail@example.com';
  var currentPassword = 'alkjsdf';

  stubRequest('put', '/users/user1', function(request){
    var user = JSON.parse(request.requestBody);

    return this.error({
      code: 401,
      error: 'invalid_credentials',
      message: 'Invalid password'
    });
  });

  andThen(function(){
    fillIn(emailInput(), newEmail);
    click(changeEmailButton());
  });

  andThen(function(){
    fillIn(currentPasswordInput(), currentPassword);
    click(changeEmailButton());
  });

  andThen(function(){
    var error = find('.alert');
    ok(error.length, 'shows error div');
    ok(error.text().indexOf('Invalid password'), 'shows error message');
  });
});
