import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('more-info-icon', {
  needs: ['component:bs-popover']
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
