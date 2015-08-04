import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';
import Ember from 'ember';

moduleForModel('app', 'model:certificate', {
  needs: modelDeps.concat([
    'adapter:certificate'
  ])
});

test('finding uses correct url', function(assert){
  let done = assert.async();
  assert.expect(2);

  let certificateId = 'my-cert-id';

  stubRequest('get', `/certificates/${certificateId}`, function(request){
    assert.ok(true, 'calls with correct URL');

    return this.success({
      id: certificateId,
      body: 'cert',
      privateKey: 'private key',
      _links: {
        account: { href: '/accounts/1' }
      }
    });
  });

  let store = this.store();

  return Ember.run(function(){
    return store.find('certificate', certificateId).then(function(){
      assert.ok(true, 'certificate did find');
    }).finally(done);
  });
});

test('reloading certificate with stack uses correct url', function(assert){
  assert.expect(1);
  let done = assert.async();
  let store = this.store();

  let certificate = Ember.run(store, 'push', 'certificate', {id:'c1'});
  let stack = Ember.run(store, 'push', 'stack', {id:'stack1'});

  stubRequest('get', `/certificates/c1`, function(request){
    assert.ok(true, 'gets correct url');
    return this.success({id:'c1'});
  });

  Ember.run(() => {
    certificate.set('stack', stack);
    certificate.reload().finally(done);
  });
});

test('creating POSTs to correct url', function(assert) {
  assert.expect(2);

  var store = this.store();
  var certificate, stack;
  Ember.run(function(){
    stack = store.createRecord('stack', {id: '1'});
    certificate = store.createRecord('certificate', {body:'cert', stack:stack});
  });

  stubRequest('post', '/accounts/1/certificates', function(request){
    assert.ok(true, 'calls with correct URL');

    return this.success(201, {
      id: 'my-certificate-id',
      body: 'cert'
    });
  });

  return Ember.run(function(){
    return certificate.save().then(function(){
      assert.ok(true, 'certificate did save');
    });
  });
});