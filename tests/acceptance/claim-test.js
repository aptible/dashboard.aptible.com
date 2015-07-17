import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';
import { stubRequest, jsonMimeType } from '../helpers/fake-server';

let App;
const invitationId = 'some-id';
const verificationCode = 'some-code';
const url = `/claim/${invitationId}/${verificationCode}`;
const orgName = "My New Org";
const invitationData = {
  id: invitationId,
  organization_name: orgName,
  inviter_name: 'Mr inviter'
};

module('Acceptance: Claim', {
  beforeEach: function() {
    App = startApp();
    stubInvitation(invitationData);
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test(`visiting ${url} as unauthenticated redirects to signup/invitation/:invitation_id/:verification_code`, function(assert) {
  visit(url);

  andThen(function(){
    assert.equal(currentURL(), `/signup/invitation/${invitationId}/${verificationCode}`);
    assert.equal(currentPath(), 'signup.invitation');
  });
});

test(`visiting ${url} as unauthenticated revisits after log in`, function(assert) {
  let userUrl = '/user-url';
  stubRequest('post', '/tokens', function(request){
    return this.success({
      id: 'my-id',
      access_token: 'my-token',
      token_type: 'bearer',
      expires_in: 2,
      scope: 'manage',
      type: 'token',
      _links: { user: { href: userUrl } }
    });
  });
  stubRequest('get', userUrl, function(){
    return this.success({
      id: 'some-id',
      username: 'some-email'
    });
  });

  stubRequest('post', '/verifications', function(request){
    let params = this.json(request);
    assert.ok(true, 'verification posted');
    assert.equal(params.verification_code, verificationCode, 'has correct verification code');

    return this.success({
      id: 'this-id',
      verification_code: params.verification_code
    });
  });

  stubIndexRequests();

  assert.expect(8);

  visit(url);
  andThen(function(){
    assert.equal(currentPath(), 'signup.invitation');
  });
  clickButton('Sign in');
  clickButton('Log in');
  andThen(function(){
    assert.equal(currentPath(), 'claim');
    assert.equal(currentURL(), `/claim/${invitationId}/${verificationCode}`);
    assert.ok(find(`:contains(${invitationData.organization_name})`).length,
              `shows org name "${invitationData.organization_name}" when redirected back to claim`);
    assert.ok(find(`:contains(${invitationData.inviter_name})`).length,
              `shows inviter name "${invitationData.inviter_name}" when redirected back to claim`);
  });

  clickButton('Accept invitation');

  andThen(function(){
    assert.equal(currentPath(), 'dashboard.stack.apps.index');
  });
});

test(`visiting ${url} as authenticated shows org name`, function(assert) {
  signInAndVisit(url);
  andThen(() => {
    assert.equal(currentPath(), 'claim');
    assert.ok(find(`:contains(${invitationData.organization_name})`).length,
              `shows org name "${invitationData.organization_name}"`);
  });
});

test(`visiting ${url} as authenticated shows inviter name`, function(assert) {
  signInAndVisit(url);
  andThen(() => {
    assert.equal(currentPath(), 'claim');
    assert.ok(find(`:contains(${invitationData.inviter_name})`).length,
              `shows inviter name "${invitationData.inviter_name}"`);
  });
});

test(`visiting ${url} as authenticated creates verification`, function(assert) {
  assert.expect(3);

  stubIndexRequests();

  stubUser();

  stubRequest('post', '/verifications', function(request){
    let params = this.json(request);
    assert.equal(params.verification_code, verificationCode, 'correct code is passed');
    assert.equal(params.invitation_id, invitationId, 'correct code is passed');
    return this.success({
      id: 'this-id',
      verification_code: verificationCode
    });
  });

  signInAndVisit(url);
  clickButton('Accept invitation');
  andThen(function(){
    assert.equal(currentPath(), 'dashboard.stack.apps.index');
  });
});

test('failed verification displays error', function(assert) {
  stubRequest('post', '/verifications', function(request){
    return [401, jsonMimeType, {}];
  });

  signInAndVisit(url);
  clickButton('Accept invitation');
  andThen(function(){
    assert.equal(currentPath(), 'claim');
    assert.ok(Ember.$(':contains(error accepting this invitation)').length, 'Failed verifications shows error');
  });
});
