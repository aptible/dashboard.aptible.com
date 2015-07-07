import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('operation-item', 'OperationItemComponent', {
  unit: true,

  needs: [
    'component:operation-icon',
    'component:bs-tooltip',
    'helper:format-utc-timestamp'
  ]
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    operation: Ember.Object.create({
      type: 'provision',
      status: 'running',
      userName: 'Test User',
      createdAt: new Date()
    })
  });

  equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  equal(component._state, 'inDOM');
});
