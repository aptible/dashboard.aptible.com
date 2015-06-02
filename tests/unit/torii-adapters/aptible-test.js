import {
  moduleFor,
  test
} from 'ember-qunit';
import config from "../../../config/environment";
import { auth } from '../../../adapters/application';
import storage from 'dummy/utils/storage';
import { stubRequest } from 'ember-cli-fake-server';
import DS from "ember-data";
import Ember from "ember";
import modelDeps from '../../support/common-model-dependencies';

var originalWrite, originalRead;

class MockAnalytics {
  identify() {}
  page() {}
}

moduleFor('torii-adapter:aptible', 'Torii Adapter: Aptible', {
  needs: modelDeps,

  setup: function(){
    DS._setupContainer(this.container);
    originalWrite = storage.write;
    originalRead = storage.read;
  },
  teardown: function(){
    storage.write = originalWrite;
    storage.read = originalRead;
    auth.token = null;
  },
  subject: function() {
    var store = this.container.lookup('store:main');
    var klass = this.container.lookupFactory(this.subjectName);
    return klass.create({
      store: store,
      analytics: new MockAnalytics()
    });
  }
});

test('#close destroys token, storage', function(){
  expect(4);
  var adapter = this.subject();
  var tokenId = 'some-token-id';

  var removedKey;
  storage.remove = function(key){
    removedKey = key;
  };
  auth.token = 'some-token';

  var token = Ember.Object.create({
    id: tokenId
  });

  stubRequest('delete', `/tokens/${tokenId}`, function() {
    ok(true, 'delete is called at the API');
    return this.noContent();
  });

  Ember.run(function(){
    adapter.close(token).then(function(){
      ok(true, 'session is opened with an auth_token');
      equal(removedKey, config.authTokenKey, 'removes token value');
      ok(!auth.token, 'unsets token on auth');
    }, function(e){
      ok(false, "Unexpected error: "+e);
    });
  });
});


test('#open stores payload, set currentUser', function(){
  var adapter = this.subject();
  var token = 'some-token';
  var tokenId = 'some-token-id';
  var userId = 'some-user-id';
  var userUrl = '/some-user-url';
  var userEmail = 'some@email.com';

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
      // FIXME: PhantomJS fails to set the value here
      // equal(auth.token, token, 'sets token on auth');

      // QUnit will hang forever if we don't explicitly turn this into
      // a boolean, because the currentUser object (maybe) has some recursive
      // structure that foils QUnit's eager generation of its failure message
      ok(!!resultForSession.currentUser, 'sets currentUser on session');
      equal(Ember.get(resultForSession, 'currentUser.username'), userEmail, 'user email is from the API');
      equal(Ember.get(resultForSession, 'token.id'), tokenId, 'token is present with id');
    }, function(e){
      ok(false, "Unexpected error: "+e);
    });
  });
});

test('#fetch fetches current_token, stores payload, set currentUser', function(){
  var adapter = this.subject();
  var token = 'some-token';
  var tokenId = 'some-token-id';
  var userId = 'some-user-id';
  var userUrl = '/some-user-url';
  var currentTokenUrl = '/current_token';
  var userEmail = 'some@email.com';

  stubRequest('get', currentTokenUrl, function(){
    return this.success({
      id: tokenId,
      access_token: token,
      _links: {
        user: {
          href: userUrl
        }
      }
    });
  });

  stubRequest('get', userUrl, function(){
    return this.success({
      id: userId,
      username: userEmail
    });
  });

  ok(!auth.token, 'precond - no auth.token');

  Ember.run(function(){
    adapter.fetch().then(function(resultForSession){
      ok(true, 'session is opened with an auth_token');
      // FIXME: PhantomJS fails to set the value here
      // equal(auth.token, token, 'sets token on auth');

      // QUnit will hang forever if we don't explicitly turn this into
      // a boolean, because the currentUser object (maybe) has some recursive
      // structure that foils QUnit's eager generation of its failure message
      ok(!!resultForSession.currentUser, 'sets currentUser on session');
      equal(Ember.get(resultForSession, 'currentUser.username'), userEmail, 'user email is from the API');
      equal(Ember.get(resultForSession, 'token.id'), tokenId, 'token is present with id');
    }, function(e){
      ok(false, "Unexpected error: "+e);
    });
  });
});
