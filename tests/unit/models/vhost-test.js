import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from "../../helpers/fake-server";

import Ember from 'ember';

moduleForModel('vhost', 'Vhost', {
  // Specify the other units that are required for this test.
  needs: [
    'adapter:vhost',
    'serializer:application',
    'model:service',
    'model:app',
    'model:stack',
    'model:operation',
    'model:database',
    'model:permission',
    'model:organization'
  ]
});

test('creating POSTs to correct url', function() {
  expect(2);

  var store = this.store();
  var vhost, service;

  Ember.run(function(){
    service = store.createRecord('service', {id: '1'});
    vhost = store.createRecord('vhost', {status:'provisioned', service:service});
  });

  stubRequest('post', '/services/1/vhosts', function(request){
    ok(true, 'calls with correct URL');

    return this.success(201, {
      id: 'my-vhost-id',
      status: 'provisioned'
    });
  });

  return Ember.run(function(){
    return vhost.save().then(function(){
      ok(true, 'vhost did save');
    });
  });
});
