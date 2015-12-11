import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('organization-switcher-option', {
  integration: true
});

test('it renders a check if isActive', function(assert) {
  let organization = { name: 'Aptible', id: 'o1' };
  this.setProperties({ organization, currentOrganization: organization });
  this.render(hbs('{{organization-switcher-option organization=organization currentOrganization=organization}}'));

  assert.equal(this.$('.fa-check.success').length, 1, 'element has a check mark');
});
