import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from "../../helpers/fake-server";

import Ember from 'ember';

moduleForModel('database', 'Database', {
  // Specify the other units that are required for this test.
  needs: [
    'model:stack',
    'model:app',
    'model:service',
    'model:operation',
    'model:permission',
    'model:role',
    'model:organization',
    'model:vhost',

    'adapter:database',
    'serializer:application'
  ]
});

test('finding uses correct url', function(){
  expect(2);
  var dbId = 'my-db-id';

  stubRequest('get', '/databases/' + dbId, function(request){
    ok(true, 'calls with correct URL');

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
      ok(true, 'database did find');
    });
  });
});

test('creating POSTs to correct url', function(){
  expect(2);

  var store = this.store();
  var db, stack;
  Ember.run(function(){
    stack = store.createRecord('stack', {id: '1'});
    db = store.createRecord('database', {handle:'my-cool-db', stack:stack});
  });

  stubRequest('post', '/accounts/1/databases', function(request){
    ok(true, 'calls with correct URL');

    return this.success(201, {
      id: 'my-db-id',
      handle: 'my-cool-db'
    });
  });

  return Ember.run(function(){
    return db.save().then(function(){
      ok(true, 'db did save');
    });
  });
});
