import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

function successfulTokenResponse(server, userUrl) {
  return server.success({
    id: 'my-id',
    access_token: 'my-token',
    token_type: 'bearer',
    expires_in: 2,
    scope: 'manage',
    type: 'token',
    _links: {
      user: {
        href: userUrl
      }
    }
  });
}

module('Acceptance: Authentication', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
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
    var error = findWithAssert('.alert.alert-danger');
    elementTextContains(error, errorMessage);
  });
});

test('logging in with correct credentials', function() {
  stubStacks();
  stubOrganization();

  var email = 'good@email.com';
  var password = 'correct';
  var userUrl = '/user-url';

  stubRequest('post', '/tokens', function(request){
    var params = JSON.parse(request.requestBody);
    equal(params.username, email, 'correct email is passed');
    equal(params.password, password, 'correct password is passed');
    equal(params.grant_type, 'password', 'correct grant_type is passed');

    return successfulTokenResponse(this, userUrl);
  });

  stubRequest('get', userUrl, function(){
    return this.success({
      id: 'some-id',
      username: 'some-email'
    });
  });

  visit('/login');
  fillIn('input[type=email]', email);
  fillIn('input[type=password]', password);
  click('button:contains(Log in)');
  andThen(function(){
    equal(currentPath(), 'stacks.index');
  });
});

test('after logging in, nav header shows user name', function(){
  stubStacks();
  stubOrganization();

  var userUrl = '/user-url',
      userName = 'Joe Hippa';

  stubRequest('post', '/tokens', function(request){
    return successfulTokenResponse(this, userUrl);
  });

  stubRequest('get', userUrl, function(){
    return this.success({
      id: 'some-id',
      name: userName
    });
  });

  visit('/login');
  click('button:contains(Log in)');
  andThen(function(){
    var nav = find('header.navbar:contains('+ userName +')');
    ok(nav.length, 'Has header with user name ' + userName);
  });
});

test('/login links to signup', function() {
  visit('/login');
  click(':contains(Create an account)');
  andThen(function(){
    equal(currentPath(), 'signup', 'linked to signup');
  });
});

test('visit /login while already logged in redirects to stack', function(){
  stubStacks();
  signInAndVisit('/login');

  andThen(function(){
    equal(currentPath(), 'stacks.index');
  });
});

test('logging out redirects to login if not logged in', function() {
  visit('/logout');
  andThen(function(){
    equal(currentPath(), 'login', 'redirected to login');
  });
});

test('logging out reloads the page', function() {
  stubStacks();
  stubOrganization();
  signInAndVisit('/');
  click('.current-user .dropdown-toggle');
  click('a:contains(Logout)');
  locationUpdatedTo('/');
});

test('visiting /signup', function() {
  visit('/signup');
  andThen(function(){
    equal(currentPath(), 'signup');
  });
});

test('visiting /signup when logged in redirects', function() {
  stubStacks();
  stubOrganization();
  signInAndVisit('/signup');
  andThen(function(){
    equal(currentPath(), 'stacks.index');
  });
});

test('Creating an account directs to login', function() {
  stubStacks(); // For loading index
  stubOrganization();

  var email = 'good@email.com';
  var password = 'correct';
  var userUrl = '/users/my-user';
  var organization = 'Great Co.';

  stubRequest('post', '/users', function(request){
    var params = JSON.parse(request.requestBody);
    equal(params.email, email, 'correct email is passed');
    equal(params.password, password, 'correct password is passed');
    return this.success({
      id: 'my-user',
      email: email
    });
  });
  stubRequest('post', '/tokens', function(request){
    var params = JSON.parse(request.requestBody);
    equal(params.username, email, 'correct email is passed');
    equal(params.password, password, 'correct password is passed');
    return successfulTokenResponse(this, userUrl);
  });
  stubRequest('get', userUrl, function(){
    return this.success({
      id: 'some-id',
      email: email
    });
  });
  stubRequest('post', '/organizations', function(request){
    var params = JSON.parse(request.requestBody);
    equal(params.name, organization, 'correct organization is passed');
    return this.success({
      id: 'my-organization',
      name: organization
    });
  });

  visit('/signup');
  fillIn('input[type=email]', email);
  fillIn('input[type=password]', password);
  fillIn('input[name=organization]', organization);
  click('button:contains(Sign Up)');
  andThen(function(){
    equal(currentPath(), 'welcome.first-app', 'directs to first app');
  });
});

test('Creating an account waits on a valid organization name', function() {
  var email = 'good@email.com';
  var password = 'correct';
  var userUrl = '/users/my-user';
  var organization = 'bad';

  visit('/signup');
  fillIn('input[type=email]', email);
  fillIn('input[type=password]', password);
  fillIn('input[name=organization]', organization);
  click('button:contains(Sign Up)');
  andThen(function(){
    equal(currentPath(), 'signup', 'path does not change');
  });
});
