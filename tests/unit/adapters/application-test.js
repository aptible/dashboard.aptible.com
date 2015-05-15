import {
  test,
  moduleFor
} from 'ember-qunit';
import DS from "ember-data";
import Ember from "ember";
import { stubRequest } from '../../helpers/fake-server';

var Moose = DS.Model.extend();

var container, store;

moduleFor('adapter:application', 'ApplicationAdapter', {
  needs: ['store:application', 'serializer:application'],
  store: Ember.inject.service(),
  setup: function(){
    var container = this.container;
    DS._setupContainer(container);
    container.register('model:moose', Moose);
    store = container.lookup('store:application');
  }

});

test('errors messages available', function(){
  stop();

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
      ok(false, 'save wrongly succeeded');
    }, function(){
      ok(true, 'save correctly failed');
      equal(moose.get('errors.message.firstObject.message'), error, 'error message is correct');
    }).finally(start);
  });
});

