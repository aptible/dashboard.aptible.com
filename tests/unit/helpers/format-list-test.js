import {
  formatList
} from '../../../helpers/format-list';
import { module, test } from 'qunit';
import Ember from "ember";

module('FormatListHelper');

test('it joins list items', function(assert) {
  let list = Ember.A([{name: 'bob'}, {name: 'jim'}, {name: 'nick'}]);
  var result = formatList([list, 'name']);
  assert.equal(result, 'bob, jim, nick', 'output is joined');
});

test('it joins list items with a custom string', function(assert) {
  let list = Ember.A([{name: 'bob'}, {name: 'jim'}, {name: 'nick'}]);
  var result = formatList([list, 'name', '-']);
  assert.equal(result, 'bob-jim-nick', 'output is joined');
});
