import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('compliance-sidebar', {
  integration: true
});

test('it shows organization dropown with multiple organizations', function(assert) {
  this.set('organizations', [{ name: 'Org 1'}, { name: 'Org 2'}]);
  this.render(hbs('{{compliance-sidebar organizations=organizations}}'));

  assert.equal(this.$('.dropdown-select').length, 1, 'includes organiztion switcher with multiple organizations');
});