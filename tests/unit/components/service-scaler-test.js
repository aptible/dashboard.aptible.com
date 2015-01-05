import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('service-scaler', 'ServiceScalerComponent', {
  setup: function(container){
    // cannot just do `needs: ['view:select']`, sadly
    container.register('view:select', Ember.Select);
  }
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    service: Ember.Object.create({
      containerCount: 1
    })
  });
  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});
