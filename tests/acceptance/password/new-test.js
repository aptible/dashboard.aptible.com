import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest, jsonMimeType } from '../../helpers/fake-server';

var App;

module('Acceptance: PasswordNew', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /password/new/:reset_code/:user_id works', function() {
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  visit(`/password/new/${resetCode}/${userId}`);
  andThen(function(){
    equal(currentPath(), 'password.new');
  });
});

test('visiting /password/new/:reset_code/:user_id signed in redirects to index', function() {
  stubOrganization();
  stubOrganizations();
  stubStacks();
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  signInAndVisit(`/password/new/${resetCode}/${userId}`);
  andThen(function(){
    equal(currentPath(), 'stacks.index');
  });
});

test('visiting /password/new/:reset_code/:user_id and submitting without password displays an error', function() {
  expect(2);
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  var newPassword = 'someGreatPassword1%';
  visit(`/password/new/${resetCode}/${userId}`);
  click('button:contains(Reset my password)');
  andThen(function(){
    equal(currentPath(), 'password.new');
    var errors = find(':contains(Password can\'t be blank)');
    notEqual(errors.length, 0, 'errors are on the page');
  });
});

test('visiting /password/new/:reset_code/:user_id and submitting without password confirmation displays an error', function() {
  expect(2);
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  var newPassword = 'someGreatPassword1%';
  visit(`/password/new/${resetCode}/${userId}`);
  fillIn('[name=password]', newPassword);
  click('button:contains(Reset my password)');
  andThen(function(){
    equal(currentPath(), 'password.new');
    var errors = find(':contains(Confirmation does not match)');
    notEqual(errors.length, 0, 'errors are on the page');
  });
});

test('visiting /password/new/:reset_code/:user_id and submitting a poor password displays an error', function() {
  expect(2);
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  var newPassword = 'somebadpassword';
  visit(`/password/new/${resetCode}/${userId}`);
  fillIn('[name=password]', newPassword);
  click('button:contains(Reset my password)');
  andThen(function(){
    equal(currentPath(), 'password.new');
    var errors = find(':contains(Password must)');
    notEqual(errors.length, 0, 'errors are on the page');
  });
});

test('visiting /password/new/:reset_code/:user_id and submitting a password creates a password reset', function() {
  expect(5);
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  var newPassword = 'someGreatPassword1%';

  stubRequest('post', '/verifications', function(request){
    var json = this.json(request);
    equal(json.type, 'password_reset', 'type is sent');
    equal(json.password, newPassword, 'password is sent');
    equal(json.reset_code, resetCode, 'reset code is sent');
    equal(json.user_id, userId, 'user id is sent');
    return this.success({
      id: 'nerf'
    });
  });

  visit(`/password/new/${resetCode}/${userId}`);
  fillIn('[name=password]', newPassword);
  fillIn('[name=password-confirmation]', newPassword);
  click('button:contains(Reset my password)');
  andThen(function(){
    equal(currentPath(), 'login');
  });
});

test('visiting /password/new/:reset_code/:user_id and submitting a password handles error', function() {
  expect(2);
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  var newPassword = 'someGreatPassword1%';
  stubRequest('post', '/verifications', function(request){
    return this.error();
  });

  visit(`/password/new/${resetCode}/${userId}`);
  fillIn('[name=password]', newPassword);
  fillIn('[name=password-confirmation]', newPassword);
  click('button:contains(Reset my password)');
  andThen(function(){
    equal(currentPath(), 'password.new');
    var errors = find(':contains(error resetting your password)');
    notEqual(errors.length, 0, 'errors are on the page');
  });
});
