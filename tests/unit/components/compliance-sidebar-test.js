import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('compliance-sidebar', {
  needs: ['component:organization-switcher', 'component:link-to-aptible']
});

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject();
  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});


test('it shows organization dropown with multiple organizations', function() {
  let component = this.subject({ organizations: [{ name: 'Org 1'}, { name: 'Org 2'}] });
  ok(component.get('multipleOrganizations'), 'has multiple organizations');
});