import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

var settingsUrl = '/settings';
var settingsProfileUrl = settingsUrl + '/profile';
var userId = 'user1'; // from signInAndVisit helper
var userEmail = 'stubbed-user@gmail.com'; // from signInAndVisit helper
var userName = 'stubbed user'; // from signInAndVisit helper

var userApiUrl = '/users/' + userId;

module('Acceptance: User Settings: Profile', {
  setup: function() {
    App = startApp();
    stubStacks();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test(settingsUrl + ' requires authentication', function(){
  expectRequiresAuthentication(settingsUrl);
});

test(settingsProfileUrl + ' requires authentication', function(){
  expectRequiresAuthentication(settingsProfileUrl);
});

test('visit ' + settingsUrl + ' redirects to profile', function(){
  signInAndVisit(settingsUrl);
  andThen(function(){
    equal(currentPath(), 'settings.profile');
  });
});

function dropdownContaining(name){
  return find('.dropdown.current-user:contains(' + name + ')');
}

function nameInput(){
  return find('input[name="name"]');
}

function updateProfileButton(){
  return find('button:contains(Update profile)');
}

test('visit ' + settingsProfileUrl + ' shows profile info', function(){
  signInAndVisit(settingsProfileUrl);

  andThen(function(){
    ok( find('h3:contains(Your Profile)').length,
        'has header' );

    ok( find('label:contains(Profile Picture)').length,
        'has profile picture block' );

    ok( find('.gravatar img').length,
        'has gravatar img');

    ok( find('.email:contains(' + userEmail + ')').length,
        'has user email');

    ok( nameInput().length, 'input for name');

    equal( nameInput().val(), userName,
           'input for name is prefilled with user name');

    ok( updateProfileButton().length,
        'button to update profile' );
  });
});

test('visit ' + settingsProfileUrl + ' allows updating name', function(){
  expect(6);

  var newName = 'Graham Shuttlesworth';

  stubRequest('put', userApiUrl, function(request){
    ok(true, 'calls PUT ' + userApiUrl);
    var user = JSON.parse(request.requestBody);

    equal(user.name, newName, 'updates with new name: ' + newName);

    return this.success({
      id: userId,
      name: user.name,
      email: user.email
    });
  });

  signInAndVisit(settingsProfileUrl);

  andThen(function(){
    ok( dropdownContaining(userName).length,
        'user dropdown shows current user name: ' + userName);

    fillIn(nameInput(), newName);
  });

  andThen(function(){
    ok( dropdownContaining(userName).length,
        'user dropdown still shows current user name: ' + userName);

    click( updateProfileButton() );
  });

  andThen(function(){
    ok( !dropdownContaining(userName).length,
        'user dropdown no longer shows old name: ' + userName);

    ok( dropdownContaining(newName).length,
        'user dropdown now shows new name: ' + newName);
  });
});
