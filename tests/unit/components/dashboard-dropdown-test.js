import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from "ember";

moduleForComponent('dashboard-dropdown', 'DashboardDropdownComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it opens, closes', function() {
  var component = this.subject();
  this.append();

  var menu = component.$('.dropdown-menu');
  equal(menu.length, 0, 'precond - dropdown is not present');

  component.$('.dropdown-toggle').click();

  menu = component.$('.dropdown-menu');
  equal(menu.length, 1, 'dropdown is present');

  component.$('.dropdown-toggle').click();

  menu = component.$('.dropdown-menu');
  equal(menu.length, 0, 'dropdown is not present');
});

test('it opens, closes when document clicked', function() {
  var component = this.subject();
  this.append();

  var menu = component.$('.dropdown-menu');
  equal(menu.length, 0, 'precond - dropdown is not present');

  component.$('.dropdown-toggle').click();

  menu = component.$('.dropdown-menu');
  equal(menu.length, 1, 'dropdown is present');

  Ember.$('#ember-testing-container').click();

  menu = component.$('.dropdown-menu');
  equal(menu.length, 0, 'dropdown is not present');
});
