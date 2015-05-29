import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('organization-switcher-option', {
});


test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject();
  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});


test('it sets isActive to true when on current organization', function() {
  let organization = { name: 'Aptible', id: 'o1' };
  let component = this.subject({ organization: organization, currentOrganization: organization});
  ok(component.get('isActive'), 'isActive is true');
});

test('it renders a check if isActive', function() {
  let organization = { name: 'Aptible', id: 'o1' };
  let component = this.subject({ organization: organization, currentOrganization: organization});
  let el = this.$();

  ok(el.find('.fa-check.success').length, 'element has a check mark');
});
