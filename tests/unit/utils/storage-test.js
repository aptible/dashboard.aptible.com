import {
  module,
  test
} from 'qunit';

import { read, write, remove } from '../../../utils/storage';

var key = '_test_someKey';

module('Unit: storage', {
  afterEach: function(){
    remove(key);
  }
});

test('unset key is undefined', function(assert) {
  var res = read(key);
  assert.equal(res, undefined, 'empty read key is undefined');
});

test('it parses a payload correctly', function(assert) {
  var content = 'bazbaz';
  write(key, content);
  var res = read(key);
  assert.equal(res, content, 'written key has a value');
});

test('an object can be written, read', function(assert) {
  var content = 'bazbaz';
  var object = { meep: content };
  write(key, object);
  var res = read(key);
  assert.equal(res.meep, content, 'written object has values');
});
