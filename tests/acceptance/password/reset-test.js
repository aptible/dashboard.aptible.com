import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;

module('Acceptance: PasswordReset', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /password/reset works', function() {
  visit('/password/reset');
  andThen(function(){
    expectInput('email');
    expectButton('Email me reset instructions');
    equal(currentPath(), 'password.reset');
  });
});

test('visiting /password/reset signed in redirects to index', function() {
  stubOrganization();
  stubOrganizations();
  stubStacks();
  signInAndVisit('/password/reset');
  andThen(function(){
    equal(currentPath(), 'stack.apps.index');
  });
});

test('visiting /password/reset and submitting an email creates password reset', function() {
  expect(2);
  let email = 'myEmail@email.com';

  stubRequest('post', '/password/resets/new', (request) => {
    equal(request.json().email, email, 'email is sent');
    request.created({});
  });

  visit('/password/reset');
  fillInput('email', email);
  clickButton('Email me reset instructions');
  andThen(function(){
    equal(currentPath(), 'login');
  });
});

test('visiting /password/reset and submitting an email handles error and resets upon departure', function() {
  expect(4);
  var email = 'myEmail@email.com';

  stubRequest('post', '/password/resets/new', (request) => request.notFound());

  visit('/password/reset');
  fillInput('email', email);
  clickButton('Email me reset instructions');

  andThen(() => {
    let error = find('.alert');

    ok(error.text().indexOf('There was an error resetting') > -1,
       'error is on the page');
    equal(currentPath(), 'password.reset');
  });

  visit('/login'); // go away
  visit('/password/reset'); // come back

  andThen(() => {
    let error = find('.alert');
    ok(!error.length, 'error is not shown');
    equal(currentPath(), 'password.reset');
  });
});
