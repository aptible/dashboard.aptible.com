import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('operation-icon', 'OperationIconComponent', {
  unit: true,

  needs: ['component:bs-tooltip']
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    type: 'provision',
    status: 'queued'
  });

  equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  equal(component._state, 'inDOM');
});
