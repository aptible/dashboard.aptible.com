import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest, jsonMimeType } from '../helpers/fake-server';

var App;

module('Acceptance: Claim', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /claim/some-id/some-code requires authentication', function() {
  visit('/claim/some-id/some-code');

  andThen(function(){
    equal(currentPath(), 'signup');
  });
});

test('visiting /claim/some-id/some-code revisits after sign in', function() {
  expect(4);

  var userUrl = '/user-url';
  stubRequest('post', '/tokens', function(request){
    return this.success({
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
  });
  stubRequest('get', userUrl, function(){
    return this.success({
      id: 'some-id',
      username: 'some-email'
    });
  });

  stubRequest('post', '/verifications', function(request){
    var params = this.json(request);
    ok(true, 'verification posted');
    return this.success({
      id: 'this-id',
      verification_code: params.verification_code
    });
  });
  stubStacks(); // For loading index
  stubOrganization();
  stubOrganizations();

  visit('/claim/some-id/some-code');
  andThen(function(){
    equal(currentPath(), 'signup');
  });
  click("a:contains(Sign in)");
  click("button:contains(Log in)");
  andThen(function(){
    equal(currentPath(), 'claim');
  });
  click('button:contains(Accept organization invitation)');
  andThen(function(){
    equal(currentPath(), 'stack.apps.index');
  });
});

test('visiting /claim/some-invitation/some-code creates verification', function() {
  expect(3);
  stubStacks(); // For loading index
  stubOrganization();
  stubOrganizations();
  stubUser();
  var verificationCode = 'some-code';
  var invitationId = 'some-invitation';

  stubRequest('post', '/verifications', function(request){
    var params = this.json(request);
    equal(params.verification_code, verificationCode, 'correct code is passed');
    equal(params.invitation_id, invitationId, 'correct code is passed');
    return this.success({
      id: 'this-id',
      verification_code: verificationCode
    });
  });

  signInAndVisit(`/claim/${invitationId}/${verificationCode}`);
  click('button:contains(Accept organization invitation)');
  andThen(function(){
    equal(currentPath(), 'stack.apps.index');
  });
});

test('failed verification displays error', function() {
  var verificationCode = 'some-code';
  var invitationId = 'some-invitation';

  stubRequest('post', '/verifications', function(request){
    var params = this.json(request);
    return [401, jsonMimeType, {}];
  });

  signInAndVisit(`/claim/${invitationId}/${verificationCode}`);
  click('button:contains(Accept organization invitation)');
  andThen(function(){
    equal(currentPath(), 'claim');
    ok(Ember.$(':contains(error accepting this invitation)').length, 'Failed verifications shows error');
  });
});

test('failed verification displays error', function() {
  var verificationCode = 'some-code';
  var invitationId = 'some-invitation';

  stubRequest('post', '/verifications', function(request){
    var params = this.json(request);
    return [401, jsonMimeType, {}];
  });

  signInAndVisit(`/claim/${invitationId}/${verificationCode}`);
  click('button:contains(Accept organization invitation)');
  andThen(function(){
    equal(currentPath(), 'claim');
    ok(Ember.$(':contains(error accepting this invitation)').length, 'Failed verifications shows error');
  });
});
