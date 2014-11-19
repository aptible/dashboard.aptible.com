import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App, server;

module('Acceptance: Authentication', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    if (server) {
      server.shutdown();
    }
  }
});

test('visiting /login', function() {
  visit('/login');

  andThen(function() {
    equal(currentPath(), 'login');
    findWithAssert('input[type=email]');
    findWithAssert('input[type=password]');
  });
});

test('logging in with bad credentials', function() {
  var email = 'bad@email.com';
  var password = 'incorrect';
  var errorMessage = 'User not found: '+email;

  stubRequest('post', '/tokens', function(request){
    var params = JSON.parse(request.requestBody);
    equal(params.username, email, 'correct email is passed');
    equal(params.password, password, 'correct password is passed');
    equal(params.grant_type, 'password', 'correct grant_type is passed');

    return this.error(401, {
      code: 401,
      error: 'invalid_credentials',
      message: errorMessage
    });
  });

  visit('/login');
  fillIn('input[type=email]', email);
  fillIn('input[type=password]', password);
  click('button:contains(Log in)');
  andThen(function(){
    equal(currentPath(), 'login');
    var error = findWithAssert('.alert.alert-warning');
    elementTextContains(error, errorMessage);
  });
});

test('logging in with correct credentials', function() {
  var email = 'good@email.com';
  var password = 'correct';

  stubApps();
  stubRequest('post', '/tokens', function(request){
    var params = JSON.parse(request.requestBody);
    equal(params.username, email, 'correct email is passed');
    equal(params.password, password, 'correct password is passed');
    equal(params.grant_type, 'password', 'correct grant_type is passed');

    return this.success({
      id: 'my-id',
      access_token: 'my-token',
      token_type: 'bearer',
      expires_in: 2,
      scope: 'manage',
      type: 'token'
    });
  });

  visit('/login');
  fillIn('input[type=email]', email);
  fillIn('input[type=password]', password);
  click('button:contains(Log in)');
  andThen(function(){
    equal(currentPath(), 'apps.index');
  });
});

test('logging out redirects to login if not logged in', function() {
  visit('/logout');
  andThen(function(){
    equal(currentPath(), 'login', 'redirected to login');
  });
});

test('logging out reloads the page', function() {
  stubApps();
  signInAndVisit('/apps');
  click('.current-user .dropdown-toggle');
  click('a:contains(Logout)');
  locationUpdatedTo('/');
});
