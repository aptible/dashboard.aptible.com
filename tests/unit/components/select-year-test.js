import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('select-year', 'SelectYearComponent', {
  unit: true,
  needs: ['template:stack/-link'],
  setup: function() {
    this.container.register('view:select', Ember.Select);
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject({});
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
