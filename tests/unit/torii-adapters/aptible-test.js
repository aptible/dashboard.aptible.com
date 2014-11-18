import {
  moduleFor,
  test
} from 'ember-qunit';
import config from "../../../config/environment";

import storage from '../../../utils/storage';

var originalWrite, originalRead;

moduleFor('torii-adapter:aptible', 'Torii Adapter: Aptible', {
  setup: function(){
    originalWrite = storage.write;
    originalRead = storage.read;
  },
  teardown: function(){
    storage.write = originalWrite;
    storage.read = originalRead;
  }
});

test('adapter stores the auth token in storage', function(){
  var adapter = this.subject();
  var token = 'some-token';

  var wroteKey, wroteVal;
  storage.write = function(key, val){
    wroteKey = key;
    wroteVal = val;
  };

  adapter.open({ access_token: token }).then(function(){
    ok(true, 'session is opened with an auth_token');
    equal(wroteKey, config.authTokenKey, 'writes to config.authTokenKey');
    equal(wroteVal, token, 'writes token value');
  }, function(e){
    ok(false, "Unexpected error: "+e);
  });
});
