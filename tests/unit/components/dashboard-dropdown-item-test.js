import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('dashboard-dropdown-item', 'DashboardDropdownItemComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function() {
  // creates the component instance
  var component = this.subject();
  equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  equal(component._state, 'inDOM');

  equal(component.element.tagName, 'LI', 'component is an li');
});
