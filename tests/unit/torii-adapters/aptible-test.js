import {
  moduleFor,
  test
} from 'ember-qunit';
import config from "../../../config/environment";
import { auth } from '../../../application/adapter';
import storage from '../../../utils/storage';
import { stubRequest } from '../../helpers/fake-server';
import DS from "ember-data";
import Ember from "ember";

var originalWrite, originalRead;

moduleFor('torii-adapter:aptible', 'Torii Adapter: Aptible', {
  needs: ['model:token', 'model:user', 'adapter:application', 'serializer:application'],
  setup: function(container){
    DS._setupContainer(container);
    originalWrite = storage.write;
    originalRead = storage.read;
  },
  teardown: function(){
    storage.write = originalWrite;
    storage.read = originalRead;
  },
  subject: function(options, klass, container) {
    var store = container.lookup('store:main');
    return klass.create({
      store: store
    });
  }
});

test('adapter stores the auth token in storage', function(){
  var adapter = this.subject();
  var token = 'some-token';
  var tokenId = 'some-token-id';
  var userId = 'some-user-id';
  var userUrl = '/some-user-url';
  var userEmail = 'some@email.com';

  var wroteKey, wroteVal;
  storage.write = function(key, val){
    wroteKey = key;
    wroteVal = val;
  };

  stubRequest('get', userUrl, function(){
    return this.success({
      id: userId,
      username: userEmail
    });
  });

  ok(!auth.token, 'precond - no auth.token');

  var optionsFromProvider = {
    id: tokenId,
    access_token: token,
    _links: {
      user: {
        href: userUrl
      }
    }
  };
  Ember.run(function(){
    adapter.open(optionsFromProvider).then(function(resultForSession){
      ok(true, 'session is opened with an auth_token');
      equal(wroteKey, config.authTokenKey, 'writes to config.authTokenKey');
      equal(wroteVal, token, 'writes token value');
      equal(auth.token, token, 'sets token on auth');
      ok(resultForSession.currentUser, 'sets currentUser on session');
      equal(Ember.get(resultForSession, 'currentUser.username'), userEmail, 'user email is from the API');
    }, function(e){
      ok(false, "Unexpected error: "+e);
    });
  });
});

test('#close destroys token, storage', function(){
  var adapter = this.subject();

  var removedKey;
  storage.remove = function(key){
    removedKey = key;
  };
  auth.token = 'some-token';

  Ember.run(function(){
    adapter.close().then(function(){
      ok(true, 'session is opened with an auth_token');
      equal(removedKey, config.authTokenKey, 'removes token value');
      ok(!auth.token, 'unsets token on auth');
    }, function(e){
      ok(false, "Unexpected error: "+e);
    });
  });
});
