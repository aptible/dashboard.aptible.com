import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('git-ref', 'GitRefComponent', {
  unit: true,

  needs: [
    'component:click-to-copy',
    'component:bs-tooltip'
  ]
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    gitRef: '60b04a6c76cf2a171893640de9a54cc92730c592'
  });

  equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  equal(component._state, 'inDOM');
});
