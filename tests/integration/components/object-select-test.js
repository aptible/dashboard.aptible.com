import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('object-select', {
  integration: true
});

test('basic attributes are set', function(assert) {
  this.render(hbs('{{object-select name="foo"}}'));

  let select = this.$('select');

  assert.equal(select.prop('name'), 'foo', 'provided name was used');
  assert.ok(select.hasClass('form-control'));
});

test('if prompt was supplied it is displayed', function(assert) {
  this.render(hbs('{{object-select prompt="Foo"}}'));

  let prompt = this.$('option:contains("Foo")');

  assert.equal(prompt.length, 1, 'prompt was found');
  assert.ok(prompt.prop('disabled'), 'prompt is disabled');
});

test('if no prompt was supplied it is not displayed', function(assert) {
  this.render(hbs('{{object-select}}'));

  assert.equal(this.$('option').length, 0, 'prompt was found');
});

test('provided items are displayed as options', function(assert) {
  this.set('listing', Ember.A([
    { name: 'one', id: 1 },
    { name: 'two', id: 2 },
    { name: 'three', id: 3 },
    { name: 'four', id: 4 }
  ]));

  this.render(hbs('{{object-select items=listing}}'));

  let options = this.$('option');
  assert.equal(options.length, 4);
  assert.equal(options.text().trim(), 'onetwothreefour');
});

test('initially selected item is properly displayed', function(assert) {
  let listing = [
    { name: 'one', id: 1 },
    { name: 'two', id: 2 },
    { name: 'three', id: 3 },
    { name: 'four', id: 4 }
  ];

  this.setProperties({
    listing,
    selectedItem: listing[2]
  });

  this.render(hbs('{{object-select items=listing selected=selectedItem}}'));

  let select = this.$('select');
  let options;

  options = this.$('option:selected');
  assert.equal(options.length, 1);
  assert.equal(select.val(), '3', 'initial selection is correct');

  this.set('selectedItem', listing[1]);

  options = this.$('option:selected');
  assert.equal(options.length, 1);
  assert.equal(select.val(), '2', 'rerenders properly when changed upstream');
});


test('when changed fires update action with new value', function(assert) {
  let listing = [
    { name: 'one', id: 1 },
    { name: 'two', id: 2 },
    { name: 'three', id: 3 },
    { name: 'four', id: 4 }
  ];

  this.setProperties({
    listing,
    selectedItem: listing[3]
  });


  this.render(hbs('{{object-select update=(action (mut selectedItem)) items=listing selected=selectedItem}}'));

  let select = this.$('select');
  assert.equal(select.val(), '4', 'initial value is correct');
  assert.equal(this.get('selectedItem'), listing[3]);

  Ember.run(function() {
    select.val('2');
    select.trigger('change');
  });

  assert.equal(select.val(), '2', 'select value is updated properly');
  assert.equal(this.get('selectedItem'), listing[1]);
});

test('update action  fired for ArrayProxy new value', function(assert) {
  let listing = [
    { name: 'one', id: 1 },
    { name: 'two', id: 2 },
    { name: 'three', id: 3 },
    { name: 'four', id: 4 }
  ];

  this.setProperties({
    listing: Ember.ArrayProxy.create({ content: listing }),
    selectedItem: listing[3]
  });


  this.render(hbs('{{object-select update=(action (mut selectedItem)) items=listing}}'));

  let select = this.$('select');

  Ember.run(function() {
    select.val('2');
    select.trigger('change');
  });

  assert.equal(select.val(), '2', 'select value is updated properly');
  assert.equal(this.get('selectedItem'), listing[1]);
});
