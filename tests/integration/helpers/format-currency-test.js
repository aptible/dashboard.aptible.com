import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('format-currency', 'helper:format-currency', {
  integration: true
});

test('properly formats an integer cents value to dollars', function(assert) {
  this.set('inputValue', 1234);

  this.render(hbs`{{format-currency inputValue}}`);

  assert.equal(this.$().text().trim(), '$12.34');
});

test('properly adds comma delimiters for large values', function(assert) {
  this.set('inputValue', 123456789);

  this.render(hbs`{{format-currency inputValue}}`);

  assert.equal(this.$().text().trim(), '$1,234,567.89');
});

test('properly formats values under $1', function(assert) {
  this.set('inputValue', 8);

  this.render(hbs`{{format-currency inputValue}}`);

  assert.equal(this.$().text().trim(), '$0.08');

  this.set('inputValue', 99);

  this.render(hbs`{{format-currency inputValue}}`);

  assert.equal(this.$().text().trim(), '$0.99');
});

test('adds a dollar sign to the beginning of the output', function(assert) {
  this.set('inputValue', 1);

  this.render(hbs`{{format-currency inputValue}}`);

  assert.equal(this.$().text().trim().indexOf('$'), 0);
});
