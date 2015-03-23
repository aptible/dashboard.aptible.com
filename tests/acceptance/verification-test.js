import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

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
    var params = this.json(request);
    equal(params.verification_code, verificationCode, 'correct code is passed');
    return this.success({
      id: 'this-id',
      verification_code: verificationCode
    });
  });

  let userData = {verified: false};
  signInAndVisit(`/verify/${verificationCode}`, userData);
  andThen(function(){
    equal(currentPath(), 'stack.apps.index');
  });
});

test('after verification, pending databases are provisioned', function(){
  expect(5);
  stubStacks(); // For loading index
  stubOrganization();
  stubOrganizations();
  var verificationCode = 'some-code';
  let dbId = 'db-id';
  let diskSize = '10';

  let dbData = [{id: dbId, initialDiskSize: diskSize}];
  stubDatabases(dbData);

  stubRequest('post', '/verifications', function(request){
    var params = this.json(request);
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
    equal(json.disk_size, diskSize);

    return this.success({
      id: 'op-id',
      type: json.type
    });
  });

  signInAndVisit('/verify/'+verificationCode);
  andThen(function(){
    equal(currentPath(), 'stack.apps.index');
  });
});

test('visiting / when not verified shows verification message with resend button', function(){
  expect(3);
  let userData = {
    id: 'user-id',
    verified: false
  };

  stubStacks();
  stubOrganizations();
  stubOrganization();

  stubRequest('post', '/resets', function(request){
    let json = this.json(request);
    equal(json.type, 'verification_code', 'posts verification code');
    return this.success(204, {});
  });

  signInAndVisit('/', userData);
  andThen(function(){
    let banner = find(':contains(Your email is not activated)');
    ok(banner.length, 'shows not-activated message');

    let resendMessage = 'Resend verification email';
    expectButton(resendMessage);
    click(findButton(resendMessage));
  });
});

test('failed verification directs to error page', function() {
  var verificationCode = 'some-code';

  stubRequest('post', '/verifications', function(request){
    let json = this.json(request);
    equal(json.verification_code, verificationCode, 'correct code is passed');
    return this.error(401, {});
  });

  signInAndVisit('/verify/'+verificationCode);
  andThen(function(){
    equal(currentPath(), 'error');
  });
});
