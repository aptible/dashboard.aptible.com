import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('dashboard-dropdown-item', 'DashboardDropdownItemComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function(assert) {
  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');

  assert.equal(component.element.tagName, 'LI', 'component is an li');
});
