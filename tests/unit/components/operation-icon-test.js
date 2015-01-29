import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('operation-icon', 'OperationIconComponent', {
  needs: []
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    tye: 'provision',
    status: 'queued'
  });

  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});
