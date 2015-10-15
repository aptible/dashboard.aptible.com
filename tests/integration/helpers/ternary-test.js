import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ternary', 'helper:ternary', {
  integration: true
});

test('if a value is falsey, return the second arg ', function(assert) {
  this.render(hbs`{{ternary 0 5}}`);
  assert.equal(this.$().text().trim(), '5');

  this.render(hbs`{{ternary null 5}}`);
  assert.equal(this.$().text().trim(), '5');

  this.render(hbs`{{ternary undefined 5}}`);
  assert.equal(this.$().text().trim(), '5');

  this.render(hbs`{{ternary 5 20}}`);
  assert.equal(this.$().text().trim(), '5');

  this.render(hbs`{{ternary false 'nope'}}`);
  assert.equal(this.$().text().trim(), 'nope');

  this.render(hbs`{{ternary 'yup' 'nope'}}`);
  assert.equal(this.$().text().trim(), 'yup');
});
