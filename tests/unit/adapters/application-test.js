import {
  test,
  moduleFor
} from 'ember-qunit';
import DS from "ember-data";
import Ember from "ember";
import { stubRequest } from 'ember-cli-fake-server';

var Moose = DS.Model.extend();

var store;

moduleFor('adapter:application', 'ApplicationAdapter', {
  needs: ['store:application', 'serializer:application'],
  setup: function(){
    var container = this.container;
    container.register('model:moose', Moose);
    store = container.lookup('store:application');
  }
});

test('errors messages available', function(assert) {
  var done = assert.async();

  var error = 'Oh my';
  var moose;
  Ember.run(function(){
    moose = store.createRecord('moose');
  });
  stubRequest('post', '/mooses', function(){
    return [422, {}, { message: error }];
  });

  Ember.run(function(){
    moose.save().then(function(){
      assert.ok(false, 'save wrongly succeeded');
    }, function(){
      assert.ok(true, 'save correctly failed');
      assert.equal(moose.get('errors.message.firstObject.message'), error, 'error message is correct');
    }).finally(done);
  });
});
