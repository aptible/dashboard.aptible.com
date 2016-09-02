import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;

module('Acceptance: PasswordReset', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /password/reset works', function(assert) {
  visit('/password/reset');
  andThen(function(){
    expectInput('email');
    expectButton('Email me reset instructions');
    assert.equal(currentPath(), 'password.reset');
  });
});

test('visiting /password/reset signed in redirects to index', function(assert) {
  stubOrganization();
  stubStacks();
  signInAndVisit('/password/reset');
  andThen(function(){
    assert.equal(currentPath(), 'requires-authorization.enclave.stack.apps.index');
  });
});

test('visiting /password/reset and submitting an email creates password reset', function(assert) {
  assert.expect(2);
  let email = 'myEmail@email.com';

  stubRequest('post', '/password/resets/new', (request) => {
    assert.equal(request.json().email, email, 'email is sent');
    request.created({});
  });

  visit('/password/reset');
  fillInput('email', email);
  clickButton('Email me reset instructions');
  andThen(function(){
    assert.equal(currentPath(), 'login');
  });
});

test('visiting /password/reset and submitting an email handles error and resets upon departure', function(assert) {
  assert.expect(4);
  var email = 'myEmail@email.com';

  stubRequest('post', '/password/resets/new', (request) => request.notFound());

  visit('/password/reset');
  fillInput('email', email);
  clickButton('Email me reset instructions');

  andThen(() => {
    let error = find('.alert');

    assert.ok(error.text().indexOf('There was an error resetting') > -1,
       'error is on the page');
    assert.equal(currentPath(), 'password.reset');
  });

  visit('/login'); // go away
  visit('/password/reset'); // come back

  andThen(() => {
    let error = find('.alert');
    assert.ok(!error.length, 'error is not shown');
    assert.equal(currentPath(), 'password.reset');
  });
});
