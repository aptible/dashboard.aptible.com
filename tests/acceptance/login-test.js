import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';
import successfulTokenResponse from '../helpers/successful-token-response';

let App;
let signupIndexPath = 'signup.index';

let email = 'good@email.com';
let password = 'Correct#Password1!3';
let userUrl = '/users/my-user';
let organization = 'Great Co.';
let name = 'Test User';

module('Acceptance: Login', {
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
    expectInput('email');
    expectInput('password');
  });
});

test('logging in with bad credentials', function() {
  let errorMessage = 'User not found: '+email;

  stubRequest('post', '/tokens', function(request){
    let params = this.json(request);
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
  fillInput('email', email);
  fillInput('password', password);
  clickButton('Log in');
  andThen(function(){
    equal(currentPath(), 'login');
    let error = findWithAssert('.alert.alert-danger');
    elementTextContains(error, errorMessage);
  });
});

test('logging in with correct credentials', function() {
  stubStacks();
  stubOrganization();
  stubOrganizations();

  stubRequest('post', '/tokens', function(request){
    let params = this.json(request);
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
  fillInput('email', email);
  fillInput('password', password);
  clickButton('Log in');
  andThen(() => {
    equal(currentPath(), 'dashboard.stack.apps.index');
  });
});

test('after logging in, nav header shows user name', function(){
  stubStacks();
  stubOrganization();
  stubOrganizations();

  let userUrl = '/user-url',
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
  clickButton('Log in');
  andThen(() => {
    let nav = find('header.navbar:contains('+ userName +')');
    ok(nav.length, 'Has header with user name ' + userName);
  });
});

test('/login links to signup', function(assert) {
  visit('/login');
  andThen(() => {
    expectLink('/signup');
    expectButton('Create an account');
  });
  clickButton('Create an account');
  andThen(() => {
    assert.equal(currentPath(), signupIndexPath, 'linked to signup');
  });
});

test('visit /login while already logged in redirects to stack', function(){
  stubStacks();
  stubOrganization();
  stubOrganizations();
  signInAndVisit('/login');

  andThen(function(){
    equal(currentPath(), 'dashboard.stack.apps.index');
  });
});

test('logging out redirects to login if not logged in', function() {
  visit('/logout');
  andThen(function(){
    equal(currentPath(), 'login', 'redirected to login');
  });
});

test('logging out reloads the page', function() {
  stubIndexRequests();
  stubRequest('delete', `/tokens/:token_id`, (req) => req.noContent());

  signInAndVisit('/');
  click('.current-user .dropdown-toggle');
  click('a:contains(Logout)');
  andThen(() => {
    expectReplacedLocation('/');
  });
});
