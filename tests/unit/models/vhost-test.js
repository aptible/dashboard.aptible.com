import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';
import Ember from 'ember';

const { run } = Ember;
const TEST_RELOAD_RETRY_DELAY = 10;

moduleForModel('vhost', 'model:vhost', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:vhost'
  ])
});

test('creating POSTs to correct url', function(assert) {
  let done = assert.async();
  assert.expect(1);

  let store = this.store();
  let vhost, service;

  Ember.run(function(){
    service = store.createRecord('service', {id: '1'});
    vhost = store.createRecord('vhost', {status:'provisioned', service:service});
  });

  stubRequest('post', '/services/1/vhosts', function(request){
    assert.ok(true, 'calls with correct URL');

    return this.noContent();
  });

  Ember.run(() => {
    return vhost.save().finally(done);
  });
});

test('updating PUTs to correct url', function(assert) {
  let done = assert.async();
  assert.expect(1);

  let store = this.store();
  let vhost, service;
  let vhostId = 'vhost-id';

  Ember.run(() => {
    service = store.createRecord('service', {id: '1'});
    vhost = store.push('vhost', {id: vhostId, status:'provisioned', service:service});
  });

  stubRequest('put', `/vhosts/${vhostId}`, function(request){
    assert.ok(true, 'calls with correct URL');

    return this.success({
      id: vhostId,
      status: 'provisioned'
    });
  });

  Ember.run(() => {
    vhost.set('virtualDomain', 'new-virtual-domain.com');
    vhost.save().finally(done);
  });
});

test('reloads while provisioning', function(assert) {
  let done = assert.async();
  assert.expect(2);

  let store = this.store();
  let vhost, service;
  let vhostId = 'vhost-id';

  stubRequest('get', `/vhosts/${vhostId}`, function(request){
    assert.ok(true, 'calls with correct URL');

    return this.success({
      id: vhostId,
      status: 'provisioning'
    });
  });

  run(() => {
    service = store.createRecord('service', {id: '1'});
    vhost = store.push('vhost', {
      id: vhostId,
      status: 'provisioning',
      service
    });

    vhost.set('_reloadRetryDelay', TEST_RELOAD_RETRY_DELAY);
  });

  stubRequest('get', `/vhosts/${vhostId}`, function(request){
    assert.ok(true, 'calls with correct URL');

    done();

    return this.success({ id: vhostId, status: 'provisioned' });
  });
});
