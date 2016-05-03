import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';
import successfulTokenResponse from '../helpers/successful-token-response';
import { AFTER_AUTH_COOKIE } from '../../login/route';
import Cookies from "ember-cli-aptible-shared/utils/cookies";

let App;
let signupIndexPath = 'signup.index';

let email = 'good@email.com';
let password = 'Correct#Password1!3';
let userUrl = '/users/my-user';

module('Acceptance: Login', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Cookies.erase(AFTER_AUTH_COOKIE);
    Ember.run(App, 'destroy');
  }
});

test('visiting /login', function(assert) {
  visit('/login');

  andThen(function() {
    assert.equal(currentPath(), 'login');
    expectInput('email');
    expectInput('password');
  });
});

test('logging in with bad credentials', function(assert) {
  let errorMessage = 'User not found: '+email;

  stubRequest('post', '/tokens', function(request){
    let params = this.json(request);
    assert.equal(params.username, email, 'correct email is passed');
    assert.equal(params.password, password, 'correct password is passed');
    assert.equal(params.grant_type, 'password', 'correct grant_type is passed');

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
    assert.equal(currentPath(), 'login');
    let error = findWithAssert('.alert.alert-danger');
    elementTextContains(error, errorMessage);
  });
});

test('logging in with correct credentials', function(assert) {
  let roleData = {
    id: 'r1',
    privileged: true,
    _links: {
      self: { href: '/roles/r1' },
      organization: { href: '/organizations/1' }
    }
  };

  stubIndexRequests();

  stubRequest('post', '/tokens', function(request){
    let params = this.json(request);
    assert.equal(params.username, email, 'correct email is passed');
    assert.equal(params.password, password, 'correct password is passed');
    assert.equal(params.grant_type, 'password', 'correct grant_type is passed');

    return successfulTokenResponse(this, userUrl);
  });

  stubRequest('get', '/roles/r1', function(){
    return this.success(roleData);
  });

  stubRequest('get', '/users/my-user/roles', function() {
    return this.success({
      _embedded: {
        roles: [roleData]
      }
    });
  });

  stubRequest('get', userUrl, function(){
    return this.success({
      id: 'my-user',
      username: 'some-email',
      _links: {
        roles: { href: '/users/my-user/roles' }
      }
    });
  });

  visit('/login');
  fillInput('email', email);
  fillInput('password', password);
  clickButton('Log in');
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.requires-read-access.stack.apps.index');
  });
});

test('after logging in, nav header shows user name', function(assert) {
  stubStacks();
  stubOrganization();
  stubOrganizations();

  let userUrl = '/user-url',
      userName = 'Joe Hippa';

  stubRequest('post', '/tokens', function(){
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
    assert.ok(nav.length, 'Has header with user name ' + userName);
  });
});

test('when redirect cookie is set, after logging in, the location is visited', function() {
  stubStacks();
  stubOrganization();
  stubOrganizations();

  let locationUrl = 'example.org/foobar',
      userUrl = '/user-url',
      userName = 'Joe Hippo';

  stubRequest('post', '/tokens', function(){
    return successfulTokenResponse(this, userUrl);
  });

  stubRequest('get', userUrl, function(){
    return this.success({
      id: 'some-id',
      name: userName
    });
  });

  // Valid for one minute
  Cookies.create(AFTER_AUTH_COOKIE, locationUrl, 0.00069);

  visit('/login');
  clickButton('Log in');
  andThen(() => {
    expectReplacedLocation(locationUrl);
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

test('visit /login while already logged in redirects to stack', function(assert) {
  stubStacks();
  stubOrganization();
  stubOrganizations();
  signInAndVisit('/login');

  andThen(function(){
    assert.equal(currentPath(), 'dashboard.requires-read-access.stack.apps.index');
  });
});

test('logging out redirects to login if not logged in', function(assert) {
  visit('/logout');
  andThen(function(){
    assert.equal(currentPath(), 'login', 'redirected to login');
  });
});

// FIXME: updating logout link to work across ember apps breaks this test
// test('logging out reloads the page', function() {
//   stubIndexRequests();
//   stubRequest('delete', `/tokens/:token_id`, (req) => req.noContent());

//   signInAndVisit('/');
//   click('.current-user .dropdown-toggle');
//   click('a:contains(Logout)');
//   andThen(() => {
//     expectReplacedLocation('/');
//   });
// });
//
