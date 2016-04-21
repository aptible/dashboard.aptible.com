import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('organization-switcher', {
  needs:['component:dashboard-dropdown', 'component:organization-switcher-option']
});


test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject();
  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});


test('it renders a menu item for each organization', function() {
  let organizations = [{ name: 'Aptible 1'}, { name: 'Aptible 2'}, { name: 'Aptible 3' }];
  let component = this.subject({ organizations });
  let el = this.$();

  ok(el.find('.organization-switcher-item').length === 3, 'has two organization options');
});
