import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('primitive-select', {
  integration: true
});

test('basic attributes are set', function(assert) {
  this.render(hbs('{{primitive-select name="foo"}}'));

  let select = this.$('select');

  assert.equal(select.prop('name'), 'foo', 'provided name was used');
  assert.ok(select.hasClass('form-control'));
});

test('if prompt was supplied it is displayed', function(assert) {
  this.render(hbs('{{primitive-select prompt="Foo"}}'));

  let prompt = this.$('option:contains("Foo")');

  assert.equal(prompt.length, 1, 'prompt was found');
  assert.ok(prompt.prop('disabled'), 'prompt is disabled');
});

test('if no prompt was supplied it is not displayed', function(assert) {
  this.render(hbs('{{primitive-select}}'));

  assert.equal(this.$('option').length, 0, 'prompt was found');
});

test('provided items are displayed as options', function(assert) {
  this.set('listing', Ember.A(['one', 'two', '3', '4']));

  this.render(hbs('{{primitive-select items=listing}}'));

  let options = this.$('option');
  assert.equal(options.length, 4);
  assert.equal(options.text().trim(), 'onetwo34');
});

test('when changed fires update action with new value', function(assert) {
  assert.expect(1);

  this.on('checkValue', function(newValue) {
    assert.equal(newValue, 'two');
  });

  this.set('listing', Ember.A(['one', 'two', '3', '4']));

  this.render(hbs('{{primitive-select update=(action "checkValue") items=listing}}'));

  let select = this.$('select');
  Ember.run(function() {
    select.val('two');
    select.trigger('change');
  });
});
