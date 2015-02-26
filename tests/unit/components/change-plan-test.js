import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('change-plan', 'ChangePlanComponent', {
  needs: [],
  setup: function() {

  }
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({});
  equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  equal(component._state, 'inDOM');
});
