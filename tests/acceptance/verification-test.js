import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: Verification', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /verify/some-code requires authentication', function() {
  expectRequiresAuthentication('/verify/some-code');
});

test('visiting /verify/some-code creates verification', function(assert) {
  stubStacks(); // For loading index
  stubOrganization();
  stubOrganizations();
  stubUser();
  var verificationCode = 'some-code';

  stubRequest('post', '/verifications', function(request){
    var params = this.json(request);
    assert.equal(params.verification_code, verificationCode, 'correct code is passed');
    return this.success({
      id: 'this-id',
      verification_code: verificationCode
    });
  });

  let userData = {verified: false};
  signInAndVisit(`/verify/${verificationCode}`, userData);
  andThen(function(){
    assert.equal(currentPath(), 'dashboard.catch-redirects.stack.apps.index');
  });
});

test('after verification, pending databases are provisioned', function(assert) {
  assert.expect(5);
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
    assert.equal(params.verification_code, verificationCode, 'correct code is passed');
    return this.success({
      id: 'this-id',
      verification_code: verificationCode
    });
  });

  stubUser({id:'user-id', verified:true});

  stubRequest('post', `/databases/${dbId}/operations`, function(request){
    assert.ok(true, 'posts to create db provision op');
    let json = this.json(request);
    assert.equal(json.type, 'provision');
    assert.equal(json.disk_size, diskSize);

    return this.success({
      id: 'op-id',
      type: json.type
    });
  });

  stubRequest('get', `/operations/op-id`, function(){
    return this.success(201, {id: 'op-id', status: 'succeeded'});
  });

  signInAndVisit('/verify/'+verificationCode);
  andThen(function(){
    assert.equal(currentPath(), 'dashboard.catch-redirects.stack.apps.index');
  });
});

test('visiting / when not verified shows verification message with resend button', function(assert) {
  assert.expect(3);
  let userData = {
    id: 'user-id',
    verified: false
  };

  stubStacks();
  stubOrganizations();
  stubOrganization();

  stubRequest('post', '/resets', function(request){
    let json = this.json(request);
    assert.equal(json.type, 'verification_code', 'posts verification code');
    return this.success(204, {});
  });

  signInAndVisit('/', userData);
  andThen(function(){
    let banner = find(':contains(Check your email for instructions)');
    assert.ok(banner.length, 'shows not-activated message');

    let resendMessage = 'Resend verification email';
    expectButton(resendMessage);
    click(findButton(resendMessage));
  });
});

test('failed verification directs to error page', function(assert) {
  var verificationCode = 'some-code';

  stubRequest('post', '/verifications', function(request){
    let json = this.json(request);
    assert.equal(json.verification_code, verificationCode, 'correct code is passed');
    return this.error(401, {});
  });

  signInAndVisit('/verify/'+verificationCode);
  andThen(function(){
    assert.equal(currentPath(), 'error');
  });
});
