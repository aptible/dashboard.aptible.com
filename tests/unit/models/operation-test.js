import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from "../../helpers/fake-server";
import Ember from 'ember';

moduleForModel('operation', 'Operation', {
  // Specify the other units that are required for this test.
  needs: [
    'model:app',
    'model:stack',
    'model:database',
    'model:permission',
    'model:role',
    'model:organization',

    'adapter:operation',
    'serializer:application'
  ]
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});

test('when creating an operation for a db, POSTs to /databases/:id/operations', function(){
  expect(2);

  var store = this.store();
  var db, op;
  Ember.run(function(){
    db = store.createRecord('database', {id: 'db-id'});
    op = store.createRecord('operation', {
      database: db,
      diskSize: 10,
      type: 'provision'
    });
  });

  stubRequest('post', '/databases/db-id/operations', function(){
    ok(true, 'posts to correct url');

    return this.success({
      id: 'op-id',
      diskSize: 10,
      type: 'provision',
      _links: {}
    });
  });

  return Ember.run(function(){
    return op.save().then(function(_op){
      ok(true, 'operation saved');
    });
  });
});
