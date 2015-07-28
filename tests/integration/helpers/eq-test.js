import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('eq', 'helper:eq', {
  integration: true
});

test('returns true for equal values', function(assert) {
  this.setProperties({
    val1: 1,
    val2: 2
  });

  this.render(hbs(`
    {{#if (eq val1 val2)}}
      Truthy!
    {{else}}
      Falsey!
    {{/if}}
  `));

  assert.equal(this.$().text().trim(), 'Falsey!');

  this.set('val2', 1);

  assert.equal(this.$().text().trim(), 'Truthy!');
});
