import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

var settingsUrl = '/settings';
var settingsProfileUrl = settingsUrl + '/profile';
// from signInAndVisit helper
var userId = 'user1';
// from signInAndVisit helper
var userEmail = 'stubbed-user@gmail.com';
// from signInAndVisit helper
var userName = 'stubbed user';

var userApiUrl = '/users/' + userId;

module('Acceptance: User Settings: Profile', {
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

test(settingsUrl + ' requires authentication', function() {
  expectRequiresAuthentication(settingsUrl);
});

test(settingsProfileUrl + ' requires authentication', function() {
  expectRequiresAuthentication(settingsProfileUrl);
});

test('visit ' + settingsUrl + ' redirects to profile', function(assert) {
  signInAndVisit(settingsUrl);
  andThen(function(){
    assert.equal(currentPath(), 'settings.profile');
  });
});

function dropdownContaining(name){
  return find('.dropdown.current-user:contains(' + name + ')');
}

function nameInput(){
  return find('input[name="name"]');
}

function updateProfileButton(){
  return find('button:contains(Change Name)');
}

test('visit ' + settingsProfileUrl + ' shows profile info', function(assert) {
  signInAndVisit(settingsProfileUrl);

  andThen(function(){
    assert.ok( find('h3:contains(Your Profile)').length,
        'has header' );

    assert.ok( find('label:contains(Profile Picture)').length,
        'has profile picture block' );

    assert.ok( find('.gravatar img').length,
        'has gravatar img');

    assert.ok( find('.email:contains(' + userEmail + ')').length,
        'has user email');

    assert.ok( nameInput().length, 'input for name');

    assert.equal( nameInput().val(), userName,
           'input for name is prefilled with user name');

    assert.ok( updateProfileButton().length,
        'button to update profile' );
  });
});

test('visit ' + settingsProfileUrl + ' allows updating name', function(assert) {
  assert.expect(6);

  var newName = 'Graham Shuttlesworth';

  stubRequest('put', userApiUrl, function(request){
    assert.ok(true, 'calls PUT ' + userApiUrl);
    var user = this.json(request);

    assert.equal(user.name, newName, 'updates with new name: ' + newName);

    return this.success({
      id: userId,
      name: user.name,
      email: user.email
    });
  });

  signInAndVisit(settingsProfileUrl);

  andThen(function(){
    assert.ok( dropdownContaining(userName).length,
        'user dropdown shows current user name: ' + userName);

    fillIn(nameInput(), newName);
  });

  andThen(function(){
    assert.ok( dropdownContaining(userName).length,
        'user dropdown still shows current user name: ' + userName);

    click( updateProfileButton() );
  });

  andThen(function(){
    assert.ok( !dropdownContaining(userName).length,
        'user dropdown no longer shows old name: ' + userName);

    assert.ok( dropdownContaining(newName).length,
        'user dropdown now shows new name: ' + newName);
  });
});
