import Ember from "ember";
import {
  moduleForComponent,
  test
} from 'ember-qunit';
import { maxChars } from 'diesel/components/handle-input/component';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('handle-input', {
  integration: true
});

test('entering value with spaces adds dashes', function(assert) {
  assert.expect(2);

  this.render(hbs`{{handle-input value=value}}`);

  var input = this.$('input');

  input.val('new val');
  input.trigger('input');

  assert.equal(input.val(), 'new-val');
  assert.equal(this.get('value'), 'new-val');
});

test('setting value with spaces adds dashes', function(assert) {
  assert.expect(2);

  this.render(hbs`{{handle-input value=value}}`);

  var input = this.$('input');

  this.set('value', 'new val');

  assert.equal(input.val(), 'new-val');
  assert.equal(this.get('value'), 'new-val');
});

test('entering value with capital letter lowercases it', function(assert){
  assert.expect(2);

  this.render(hbs`{{handle-input value=value}}`);

  var input = this.$('input');

  input.val('newVAL');
  input.trigger('input');

  assert.equal(input.val(), 'newval');
  assert.equal(this.get('value'), 'newval');
});

test('setting value with capital letter lowercases it', function(assert){
  assert.expect(2);

  this.render(hbs`{{handle-input value=value}}`);

  var input = this.$('input');

  this.set('value', 'newVAL');

  assert.equal(input.val(), 'newval');
  assert.equal(this.get('value'), 'newval');
});

test('entering value with bad char removes it', function(assert){
  assert.expect(2);

  this.render(hbs`{{handle-input value=value}}`);

  var input = this.$('input');

  input.val('abc^&*def');
  input.trigger('input');

  assert.equal(input.val(), 'abcdef');
  assert.equal(this.get('value'), 'abcdef');
});

test('setting value with bad char removes it', function(assert){
  assert.expect(2);

  this.render(hbs`{{handle-input value=value}}`);

  var input = this.$('input');

  this.set('value', 'abc^&*def');

  assert.equal(input.val(), 'abcdef');
  assert.equal(this.get('value'), 'abcdef');
});

test(`entering more than ${maxChars} chars truncates to ${maxChars}`, function(assert){
  assert.expect(3);

  this.render(hbs`{{handle-input value=value}}`);

  var input = this.$('input');

  let text = '';
  for (let i=0; i<maxChars; i++){
    text += 'x';
  }
  let tooLongText = text + 'x';
  assert.equal(tooLongText.length, maxChars + 1, 'precond - ensure test text is too long');

  input.val(tooLongText);
  input.trigger('input');

  assert.equal(input.val(), text);
  assert.equal(this.get('value'), text);
});

test(`setting more than ${maxChars} chars truncates to ${maxChars}`, function(assert){
  assert.expect(3);

  this.render(hbs`{{handle-input value=value}}`);

  var input = this.$('input');

  let text = '';
  for (let i=0; i<maxChars; i++){
    text += 'x';
  }
  let tooLongText = text + 'x';
  assert.equal(tooLongText.length, maxChars + 1, 'precond - ensure test text is too long');

  this.set('value', tooLongText);

  assert.equal(input.val(), text);
  assert.equal(this.get('value'), text);
});

test(`autofocusable`, function(assert){
  this.render(hbs`{{handle-input autofocus=true}}`);

  var el = this.$('input')[0];

  assert.equal(document.activeElement, el, 'input is focused');
});
