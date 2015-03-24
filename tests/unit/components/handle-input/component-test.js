import Ember from "ember";
import {
  moduleForComponent,
  test
} from 'ember-qunit';
import {maxChars} from 'diesel/components/handle-input/component';

moduleForComponent('handle-input', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('entering value with spaces adds dashes', function(assert) {
  assert.expect(2);

  var component = this.subject();
  var element = this.$();

  var input = Ember.$(element, 'input');

  input.val('new val');
  input.trigger('input');

  assert.equal(input.val(), 'new-val');
  assert.equal(component.get('value'), 'new-val');
});

test('setting value with spaces adds dashes', function(assert) {
  assert.expect(2);

  var component = this.subject();
  var element = this.render();

  var input = Ember.$(element, 'input');

  Ember.run(component, 'set', 'value', 'new val');

  assert.equal(input.val(), 'new-val');
  assert.equal(component.get('value'), 'new-val');
});

test('entering value with capital letter lowercases it', function(assert){
  assert.expect(2);

  var component = this.subject();
  var element = this.$();

  var input = Ember.$(element, 'input');

  input.val('newVAL');
  input.trigger('input');

  assert.equal(input.val(), 'newval');
  assert.equal(component.get('value'), 'newval');
});

test('setting value with capital letter lowercases it', function(assert){
  assert.expect(2);

  var component = this.subject();
  var element = this.$();

  var input = Ember.$(element, 'input');

  Ember.run(component, 'set', 'value', 'newVAL');

  assert.equal(input.val(), 'newval');
  assert.equal(component.get('value'), 'newval');
});

test('entering value with bad char removes it', function(assert){
  assert.expect(2);

  var component = this.subject();
  var element = this.$();

  var input = Ember.$(element, 'input');

  input.val('abc^&*def');
  input.trigger('input');

  assert.equal(input.val(), 'abcdef');
  assert.equal(component.get('value'), 'abcdef');
});

test('setting value with bad char removes it', function(assert){
  assert.expect(2);

  var component = this.subject();
  var element = this.$();

  var input = Ember.$(element, 'input');

  Ember.run(component, 'set', 'value', 'abc^&*def');

  assert.equal(input.val(), 'abcdef');
  assert.equal(component.get('value'), 'abcdef');
});

test(`entering more than ${maxChars} chars truncates to ${maxChars}`, function(assert){
  assert.expect(3);

  var component = this.subject();
  var element = this.$();

  var input = Ember.$(element, 'input');

  let text = '';
  for (let i=0; i<maxChars; i++){
    text += 'x';
  }
  let tooLongText = text + 'x';
  assert.equal(tooLongText.length, maxChars + 1);

  input.val(tooLongText);
  input.trigger('input');

  assert.equal(input.val(), text);
  assert.equal(component.get('value'), text);
});

test(`setting more than ${maxChars} chars truncates to ${maxChars}`, function(assert){
  assert.expect(3);

  var component = this.subject();
  var element = this.$();

  var input = Ember.$(element, 'input');

  let text = '';
  for (let i=0; i<maxChars; i++){
    text += 'x';
  }
  let tooLongText = text + 'x';
  assert.equal(tooLongText.length, maxChars + 1);

  Ember.run(component, 'set', 'value', tooLongText);

  assert.equal(input.val(), text);
  assert.equal(component.get('value'), text);
});

test(`autofocusable`, function(assert){
  var component = this.subject({autofocus:true});

  var $el = this.$();
  var el = $el[0];
  assert.equal(document.activeElement, el, 'input is focused');
});
