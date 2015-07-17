import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('dashboard-dropdown-user-menu', 'DashboardDropdownUserMenuComponent', {
  needs: ['component:dashboard-dropdown-item', 'component:link-to-aptible']
});

test('it renders', function(assert) {
  // creates the component instance
  var component = this.subject({
    user: Ember.Object.create({ name: 'Test User' })
  });
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
