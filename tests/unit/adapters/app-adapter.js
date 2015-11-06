import {
  test,
  moduleFor
} from 'ember-qunit';
import Ember from "ember";
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';

var store;

moduleFor('adapter:app', 'AppAdapter', {
  needs: modelDeps.concat([
    'store:application',
    'serializer:application'
  ]),
  setup: function(){
    store = this.container.lookup('store:application');
  }
});

test('findQuery uses correct URL', function(assert) {
  var done = assert.async();
  assert.expect(1);

  stubRequest('get', '/accounts/my-stack-1/databases', function() {
    assert.ok(true, 'uses correct URL');
    done();
    return this.success({});
  });

  Ember.run(function() {
    var stack = store.createRecord('stack', { id: 'my-stack-1' });
    store.find('app', { stack: stack });
  });
});
