import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('aptible-ability', 'AptibleAbilityComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function(assert) {
  assert.expect(1);

  // creates the component instance
  var component = this.subject({
    user: {
      can: Ember.RSVP.resolve
    },
    scope: 'read',
    stack: {}
  });
  assert.equal(component._state, 'preRender');

  // appends the component to the page

  // FIXME this call will fail for a tagless (tagName === '') component
  // this.render();
  // equal(component._state, 'inDOM');
});
