import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('stacks-nav', 'StacksNavComponent', {
  unit: true
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    stacks: Ember.A([])
  });

  equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  equal(component._state, 'inDOM');
});
