import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from "../../helpers/fake-server";

import Ember from 'ember';

moduleForModel('app', 'App', {
  needs: [
    'model:service',
    'model:stack',
    'model:database',
    'model:vhost',
    'model:operation',
    'model:permission',
    'model:role',
    'model:organization',

    'adapter:app',
    'serializer:application'
  ]
});

test('finding uses correct url', function(){
  expect(2);

  var appId = 'my-app-id';

  stubRequest('get', '/apps/' + appId, function(request){
    ok(true, 'calls with correct URL');

    return this.success({
      id: appId,
      handle: 'my-cool-app',
      _links: {
        account: { href: '/accounts/1' }
      }
    });
  });

  var store = this.store();

  return Ember.run(function(){
    return store.find('app', appId).then(function(){
      ok(true, 'app did find');
    });
  });
});

test('creating POSTs to correct url', function(){
  expect(2);

  var store = this.store();
  var app, stack;
  Ember.run(function(){
    stack = store.createRecord('stack', {id: '1'});
    app = store.createRecord('app', {handle:'my-cool-app', stack:stack});
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

test('#isDeprovisioned', function(){
  var app = this.subject();

  ok(!app.get('isDeprovisioned'));

  Ember.run(function(){
    app.set('status', 'deprovisioned');
  });

  ok(app.get('isDeprovisioned'));
});
