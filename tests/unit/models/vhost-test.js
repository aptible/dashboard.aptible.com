import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from "../../helpers/fake-server";
import modelDeps from '../../support/common-model-dependencies';

import Ember from 'ember';

moduleForModel('vhost', 'Vhost', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:vhost'
  ])
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

test('updating PUTs to correct url', function() {
  expect(2);

  var store = this.store();
  var vhost, service;
  let vhostId = 'vhost-id';

  Ember.run(function(){
    service = store.createRecord('service', {id: '1'});
    vhost = store.push('vhost', {id: vhostId, status:'provisioned', service:service});
  });

  stubRequest('put', `/vhosts/${vhostId}`, function(request){
    ok(true, 'calls with correct URL');

    return this.success({
      id: vhostId,
      status: 'provisioned'
    });
  });

  return Ember.run(function(){
    vhost.set('virtualDomain', 'new-virtual-domain.com');
    return vhost.save().then(function(){
      ok(true, 'vhost did update');
    });
  });
});
