import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('dashboard-dropdown-organization-menu', 'DashboardDropdownOrganizationMenuComponent', {
  needs: ['component:dashboard-dropdown-item', 'component:link-to-aptible']
});

test('it renders', function() {
  // creates the component instance
  var component = this.subject({
    organization: Ember.Object.create({ name: 'Foundry', id: '123' })
  });
  equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  equal(component._state, 'inDOM');
});
