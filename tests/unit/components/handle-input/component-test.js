import Ember from "ember";
import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('handle-input', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('entering value with spaces adds dashes', function(assert) {
  assert.expect(2);

  var component = this.subject();
  var element = this.append();

  var input = Ember.$(element, 'input');

  input.val('new val');
  input.trigger('input');

  assert.equal(input.val(), 'new-val');
  assert.equal(component.get('value'), 'new-val');
});

test('setting value with spaces adds dashes', function(assert) {
  assert.expect(2);

  var component = this.subject();
  var element = this.append();

  var input = Ember.$(element, 'input');

  Ember.run(component, 'set', 'value', 'new val');

  assert.equal(input.val(), 'new-val');
  assert.equal(component.get('value'), 'new-val');
});
