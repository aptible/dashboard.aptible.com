import {
  test
} from 'ember-qunit';

import { read, write, remove } from '../../../utils/storage';

var key = '_test_someKey';

module('Unit: storage', {
  teardown: function(){
    remove(key);
  }
});

test('unset key is undefined', function(){
  var res = read(key);
  equal(res, undefined, 'empty read key is undefined');
});

test('it parses a payload correctly', function(){
  var content = 'bazbaz';
  write(key, content);
  var res = read(key);
  equal(res, content, 'written key has a value');
});

test('an object can be written, read', function(){
  var content = 'bazbaz';
  var object = { meep: content };
  write(key, object);
  var res = read(key);
  equal(res.meep, content, 'written object has values');
});
