import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

module('Acceptance: PasswordNew', {
  beforeEach: function() {
    this.application = startApp();
  },
  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /password/new/:reset_code/:user_id works', function(assert) {
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  visit(`/password/new/${resetCode}/${userId}`);
  andThen(function(){
    assert.equal(currentPath(), 'password.new');
  });
});

test('visiting /password/new/:reset_code/:user_id signed in redirects to index', function(assert) {
  stubOrganization();
  stubOrganizations();
  stubStacks();
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  signInAndVisit(`/password/new/${resetCode}/${userId}`);
  andThen(function(){
    assert.equal(currentPath(), 'dashboard.catch-redirects.stack.apps.index');
  });
});

test('visiting /password/new/:reset_code/:user_id and submitting without password displays an error', function(assert) {
  assert.expect(2);
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  visit(`/password/new/${resetCode}/${userId}`);
  click('button:contains(Reset my password)');
  andThen(function(){
    assert.equal(currentPath(), 'password.new');
    var errors = find(':contains(Password can\'t be blank)');
    assert.notEqual(errors.length, 0, 'errors are on the page');
  });
});

test('visiting /password/new/:reset_code/:user_id and submitting without password confirmation displays an error', function(assert) {
  assert.expect(2);
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  var newPassword = 'someGreatPassword1%';
  visit(`/password/new/${resetCode}/${userId}`);
  fillIn('[name=password]', newPassword);
  click('button:contains(Reset my password)');
  andThen(function(){
    assert.equal(currentPath(), 'password.new');
    var errors = find(':contains(Confirmation does not match)');
    assert.notEqual(errors.length, 0, 'errors are on the page');
  });
});

test('visiting /password/new/:reset_code/:user_id and submitting a poor password displays an error', function(assert) {
  assert.expect(2);
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  var newPassword = 'somebadpassword';
  visit(`/password/new/${resetCode}/${userId}`);
  fillIn('[name=password]', newPassword);
  click('button:contains(Reset my password)');
  andThen(function(){
    assert.equal(currentPath(), 'password.new');
    var errors = find(':contains(Password must)');
    assert.notEqual(errors.length, 0, 'errors are on the page');
  });
});

test('visiting /password/new/:reset_code/:user_id and submitting a password creates a password reset', function(assert) {
  assert.expect(5);
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  var newPassword = 'someGreatPassword1%';

  stubRequest('post', '/verifications', function(request){
    var json = this.json(request);
    assert.equal(json.type, 'password_reset', 'type is sent');
    assert.equal(json.password, newPassword, 'password is sent');
    assert.equal(json.reset_code, resetCode, 'reset code is sent');
    assert.equal(json.user_id, userId, 'user id is sent');
    return this.success({
      id: 'nerf'
    });
  });

  visit(`/password/new/${resetCode}/${userId}`);
  fillIn('[name=password]', newPassword);
  fillIn('[name=password-confirmation]', newPassword);
  click('button:contains(Reset my password)');
  andThen(function(){
    assert.equal(currentPath(), 'login');
  });
});

test('visiting /password/new/:reset_code/:user_id and submitting a password handles error', function(assert) {
  assert.expect(2);
  var userId = 'abcUserId';
  var resetCode = 'defResetCode';
  var newPassword = 'someGreatPassword1%';
  stubRequest('post', '/verifications', function(){
    return this.error();
  });

  visit(`/password/new/${resetCode}/${userId}`);
  fillIn('[name=password]', newPassword);
  fillIn('[name=password-confirmation]', newPassword);
  click('button:contains(Reset my password)');
  andThen(function(){
    assert.equal(currentPath(), 'password.new');
    var errors = find(':contains(error resetting your password)');
    assert.notEqual(errors.length, 0, 'errors are on the page');
  });

  andThen(() => {
    // TODO: remove this when on Ember Data 2.x

    try {
      Ember.run(this.application, 'destroy');
    } catch(e) {
      // swallow error from Ember Data 1.0.0-beta.19.2:
      // You can only unload a record which is not inFlight. `<verification:null>`
      //
      // this is happening because the errored request leaves the model in `inflight`
      // state
    }
  });
});
