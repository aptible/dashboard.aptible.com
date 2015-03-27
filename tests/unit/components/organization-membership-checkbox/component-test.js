import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('organization-membership-checkbox', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function(assert) {
  assert.expect(2);

  let noop = function(){};
  let mockChangeset = {
    value: noop,
    subscribe: noop,
    subscribeAll: noop,
    forEachValue: noop
  };

  var component = this.subject({changeset: mockChangeset});
  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});
