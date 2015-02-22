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
  stubOrganization();
  stubOrganizations();
  stubUser();
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
    equal(currentPath(), 'stacks.index');
  });
});

test('after verification, pending databases are provisioned', function(){
  expect(4);
  stubStacks(); // For loading index
  stubOrganization();
  stubOrganizations();
  var verificationCode = 'some-code';
  let dbId = 'db-id';

  let dbData = [{id: dbId}];
  stubDatabases(dbData);

  stubRequest('post', '/verifications', function(request){
    var params = JSON.parse(request.requestBody);
    equal(params.verification_code, verificationCode, 'correct code is passed');
    return this.success({
      id: 'this-id',
      verification_code: verificationCode
    });
  });

  stubUser({id:'user-id', verified:true});

  stubRequest('post', `/databases/${dbId}/operations`, function(request){
    ok(true, 'posts to create db provision op');
    let json = this.json(request);
    equal(json.type, 'provision');

    return this.success({
      id: 'op-id',
      type: json.type
    });
  });

  signInAndVisit('/verify/'+verificationCode);
  andThen(function(){
    equal(currentPath(), 'stacks.index');
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
