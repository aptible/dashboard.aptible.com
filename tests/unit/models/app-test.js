import {
  moduleForModel,
  test
} from 'ember-qunit';

import Ember from 'ember';

import Pretender from 'pretender';

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

  server = new Pretender(function(){
    this.post('/accounts/1/apps', function(request){
      ok(true, 'calls with correct URL');

      return [200, {}, {
        id: 'my-app-id',
        handle: 'my-cool-app'
      }];
    });
  });

  return Ember.run(function(){
    return app.save().then(function(){
      ok(true, 'app did save');
    });
  });
});
