import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

const challengeId = 'the-user-id';
const verificationCode = 'the-reset-code';

module('Acceptance: Password Reset Completion (PasswordResetChallenge workflow)', {
  beforeEach: function() {
    this.application = startApp();
  },
  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /password/update/:challenge_id/:verification_code works', function(assert) {
  visit(`/password/update/${challengeId}/${verificationCode}`);
  andThen(function(){
    assert.equal(currentPath(), 'password.update');
  });
});

test('visiting /password/update/:challenge_id/:verification_code signed in redirects to index', function(assert) {
  stubOrganization();
  stubStacks();
  signInAndVisit(`/password/update/${challengeId}/${verificationCode}`);
  andThen(function(){
    assert.equal(currentPath(), 'requires-authorization.enclave.stack.apps.index');
  });
});

test('visiting /password/update/:challenge_id/:verification_code and submitting without password displays an error', function(assert) {
  assert.expect(2);
  visit(`/password/update/${challengeId}/${verificationCode}`);
  click('button:contains(Reset my password)');
  andThen(function(){
    assert.equal(currentPath(), 'password.update');
    var errors = find(':contains(Password can\'t be blank)');
    assert.notEqual(errors.length, 0, 'errors are on the page');
  });
});

test('visiting /password/update/:challenge_id/:verification_code and submitting without password confirmation displays an error', function(assert) {
  assert.expect(2);
  var newPassword = 'someGreatPassword1%';
  visit(`/password/update/${challengeId}/${verificationCode}`);
  fillIn('[name=password]', newPassword);
  click('button:contains(Reset my password)');
  andThen(function(){
    assert.equal(currentPath(), 'password.update');
    var errors = find(':contains(Confirmation does not match)');
    assert.notEqual(errors.length, 0, 'errors are on the page');
  });
});

test('visiting /password/update/:challenge_id/:verification_code and submitting a poor password displays an error', function(assert) {
  assert.expect(2);
  var newPassword = 'somebadpassword';
  visit(`/password/update/${challengeId}/${verificationCode}`);
  fillIn('[name=password]', newPassword);
  click('button:contains(Reset my password)');
  andThen(function(){
    assert.equal(currentPath(), 'password.update');
    var errors = find(':contains(Password must)');
    assert.notEqual(errors.length, 0, 'errors are on the page');
  });
});

test('visiting /password/update/:challenge_id/:verification_code and submitting a password creates a password reset', function(assert) {
  assert.expect(5);
  var challengeId = 'defResetCode';
  var newPassword = 'someGreatPassword1%';

  stubRequest('post', '/verifications', function(request){
    var json = this.json(request);
    assert.equal(json.type, 'password_reset_challenge', 'type is sent');
    assert.equal(json.password, newPassword, 'password is sent');
    assert.equal(json.challenge_id, challengeId, 'challenge id is sent');
    assert.equal(json.verification_code, verificationCode, 'verification code is sent');
    return this.success({
      id: 'nerf'
    });
  });

  visit(`/password/update/${challengeId}/${verificationCode}`);
  fillIn('[name=password]', newPassword);
  fillIn('[name=password-confirmation]', newPassword);
  click('button:contains(Reset my password)');
  andThen(function(){
    assert.equal(currentPath(), 'login');
  });
});

test('visiting /password/update/:challenge_id/:verification_code and submitting a password handles error', function(assert) {
  assert.expect(2);
  var challengeId = 'defResetCode';
  var newPassword = 'someGreatPassword1%';
  stubRequest('post', '/verifications', function(){
    return this.error();
  });

  visit(`/password/update/${challengeId}/${verificationCode}`);
  fillIn('[name=password]', newPassword);
  fillIn('[name=password-confirmation]', newPassword);
  click('button:contains(Reset my password)');
  andThen(function(){
    assert.equal(currentPath(), 'password.update');
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
