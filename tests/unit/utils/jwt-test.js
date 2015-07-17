import {
  module,
  test
} from 'qunit';

import JWT from '../../../utils/jwt';

module('Unit: JWT');

test('it parses a payload correctly', function(assert) {
  // from jwt.io:
  var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbl9pZCI6MTIzLCJuYW1lIjoiY2F0IERvZSIsImFkbWluIjp0cnVlfQ.ZJ3QV_1K_k_ODAVbNK1Xt8ANEdT2ujX572C0Zm_-fxs';

  var jwt = JWT.create({token:token});

  assert.deepEqual(jwt.get('payload'),
            { "application_id": 123, "name": "cat Doe", "admin": true },
            'parses payload correctly');
});

test('it throws if token is incorrectly formatted', function(assert) {
  var badToken = "abc.def.ghi";
  var jwt = JWT.create({token:badToken});

  assert.throws(function(){
    jwt.get('payload');
  }, /invalid payload/);
});

test('it throws if token is missing payload part', function(assert) {
  var badToken = "abc-def-ghi";
  var jwt = JWT.create({token:badToken});

  assert.throws(function(){
    jwt.get('payload');
  }, /missing payload/);
});
