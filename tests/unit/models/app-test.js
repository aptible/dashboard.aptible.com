import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from "../../helpers/fake-server";

import Ember from 'ember';

var server;

moduleForModel('app', 'App', {
  needs: ['adapter:app', 'serializer:application']
});

test('creating POSTs to correct url', function(){
  expect(2);

  var store = this.store();
  var app = Ember.run(function(){
    return store.createRecord('app', {handle:'my-cool-app', account: {id:'1'}});
  });

  stubRequest('post', '/accounts/1/apps', function(request){
    ok(true, 'calls with correct URL');

    return this.success(201, {
      id: 'my-app-id',
      handle: 'my-cool-app'
    });
  });

  return Ember.run(function(){
    return app.save().then(function(){
      ok(true, 'app did save');
    });
  });
});
