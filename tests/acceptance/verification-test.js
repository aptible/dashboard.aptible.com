import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest, jsonMimeType } from '../helpers/fake-server';

var App;

module('Acceptance: Verification', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /verify/some-code requires authentication', function() {
  expectRequiresAuthentication('/verify/some-code');
});

test('visiting /verify/some-code creates verification', function() {
  stubStacks(); // For loading index

  var verificationCode = 'some-code';

  stubRequest('post', '/verifications', function(request){
    var params = JSON.parse(request.requestBody);
    equal(params.verification_code, verificationCode, 'correct code is passed');
    return this.success({
      id: 'this-id',
      verification_code: verificationCode
    });
  });

  signInAndVisit('/verify/'+verificationCode);
  andThen(function(){
    equal(currentPath(), 'stacks.stack.apps.index');
  });
});

test('failed verificaton directs to error page', function() {
  var verificationCode = 'some-code';

  stubRequest('post', '/verifications', function(request){
    var params = JSON.parse(request.requestBody);
    equal(params.verification_code, verificationCode, 'correct code is passed');
    return [401, jsonMimeType, {}];
  });

  signInAndVisit('/verify/'+verificationCode);
  andThen(function(){
    equal(currentPath(), 'error');
  });
});
