import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gb-to-tb', 'helper:gb-to-tb', {
  integration: true
});

test('converts a GB value to TB', function(assert) {
  this.set('gb', 1000);
  this.render(hbs`{{gb-to-tb gb}}`);
  assert.equal(this.$().text().trim(), '1');

  this.set('gb', 2500);
  this.render(hbs`{{gb-to-tb gb}}`);
  assert.equal(this.$().text().trim(), '2.5');

  this.set('gb', 10);
  this.render(hbs`{{gb-to-tb gb}}`);
  assert.equal(this.$().text().trim(), '0.01');
});
