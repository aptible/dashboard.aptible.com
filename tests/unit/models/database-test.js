import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';

import Ember from 'ember';

const { run } = Ember;
const TEST_RELOAD_RETRY_DELAY = 10;

moduleForModel('database', 'model:database', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:database'
  ])
});

test('finding uses correct url', function(assert) {
  assert.expect(2);
  var dbId = 'my-db-id';

  stubRequest('get', '/databases/' + dbId, function(){
    assert.ok(true, 'calls with correct URL');

    return this.success({
      id: dbId,
      handle: 'my-cool-database',
      _links: {
        account: { href: '/accounts/1' }
      }
    });
  });

  var store = this.store();

  return Ember.run(function(){
    return store.find('database', dbId).then(function(){
      assert.ok(true, 'database did find');
    });
  });
});

test('reloading uses correct url', function(assert){
  let done = assert.async();
  assert.expect(1);

  let store = this.store();
  let dbId = 'db-id';
  let db = Ember.run(store, 'push', 'database', {id:dbId});
  let stack = Ember.run(store, 'push', 'stack', {id:'stackid'});

  stubRequest('get', `/databases/${dbId}`, function(){
    assert.ok(true, 'calls with correct URL');
    return this.success({id: dbId});
  });

  Ember.run(() => {
    db.set('stack',stack);
    db.reload().finally(done);
  });
});

test('creating POSTs to correct url', function(assert) {
  assert.expect(2);

  var store = this.store();
  var db, stack;
  Ember.run(function(){
    stack = store.createRecord('stack', {id: '1'});
    db = store.createRecord('database', {handle:'my-cool-db', stack:stack});
  });

  stubRequest('post', '/accounts/1/databases', function(){
    assert.ok(true, 'calls with correct URL');

    return this.success(201, {
      id: 'my-db-id',
      handle: 'my-cool-db'
    });
  });

  return Ember.run(function(){
    return db.save().then(function(){
      assert.ok(true, 'db did save');
    });
  });
});

test('reloads while provisioning', function(assert){
  let done = assert.async();
  assert.expect(2);

  let store = this.store();
  let dbId = 'db-id';

  stubRequest('get', `/databases/${dbId}`, function() {
    assert.ok(true, 'calls with correct URL');

    return this.success({id: dbId, status: 'provisioning'});
  });

  let db;
  run(() => {
    db = store.push('database', {
      id: dbId,
      status: 'provisioning'
    });

    db.set('_reloadRetryDelay', TEST_RELOAD_RETRY_DELAY);
  });

  stubRequest('get', `/databases/${dbId}`, function() {
    assert.ok(true, 'calls with correct URL');

    done();

    return this.success({id: dbId, status: 'provisioned'});
  });
});
