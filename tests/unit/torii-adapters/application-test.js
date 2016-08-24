import {
  moduleFor,
  test
} from 'ember-qunit';
import config from "diesel/config/environment";
import { getAccessToken, setAccessToken } from '../../../adapters/application';
import storage from 'diesel/utils/storage';
import { stubRequest } from 'ember-cli-fake-server';
import Ember from "ember";
import modelDeps from '../../support/common-model-dependencies';

var originalWrite, originalRead, userIdForAnalytics, userDataForAnalytics, originalRemove;

class MockAnalytics {
  identify(id, data) {
    userIdForAnalytics = id;
    userDataForAnalytics = data;
  }
  page() {}
}

moduleFor('torii-adapter:application', 'Torii Adapter: Aptible', {
  needs: modelDeps,

  setup: function(){
    originalWrite = storage.write;
    originalRead = storage.read;
    originalRemove = storage.remove;
  },
  teardown: function(){
    storage.write = originalWrite;
    storage.read = originalRead;
    storage.remove = originalRemove;
    setAccessToken(null);
    userIdForAnalytics = null;
    userDataForAnalytics = null;
  }
});

test('#close destroys token, storage by default', function(assert){
  assert.expect(4);
  const done = assert.async();
  var adapter = this.subject({
    analytics: new MockAnalytics()
  });
  var tokenId = 'some-token-id';

  var removedKey;
  storage.remove = function(key){
    removedKey = key;
  };
  setAccessToken('some-token');

  var token = Ember.Object.create({
    id: tokenId
  });

  stubRequest('delete', `/tokens/${tokenId}`, function() {
    assert.ok(true, 'delete is called at the API');
    return this.noContent();
  });

  Ember.run(function(){
    adapter.close({token: token}).then(function(){
      assert.ok(true, 'session is opened with an auth_token');
      assert.equal(removedKey, config.authTokenKey, 'removes token value');
      assert.ok(!getAccessToken(), 'unsets token on auth');
    }).finally(done);
  });
});


test('#open stores payload, set currentUser', function(assert){
  const done = assert.async();
  assert.expect();

  var adapter = this.subject({
    analytics: new MockAnalytics()
  });
  var token = 'some-token';
  var tokenId = 'some-token-id';
  var userId = 'some-user-id';
  var userUrl = '/some-user-url';
  var userEmail = 'some@email.com';
  var tokenUrl = '/some-token-url';

  stubRequest('get', userUrl, function(){
    return this.success({
      id: userId,
      username: userEmail
    });
  });

  assert.ok(!getAccessToken(), 'precond - no auth token');

  var optionsFromProvider = {
    id: tokenId,
    access_token: token,
    _links: {
      user: {
        href: userUrl
      },
      self: {
        href: tokenUrl
      }
    }
  };

  Ember.run(function(){
    adapter.open(optionsFromProvider).then(function(resultForSession){
      assert.ok(true, 'session is opened with an auth_token');
      assert.equal(getAccessToken(), token, 'sets token on auth');

      // QUnit will hang forever if we don't explicitly turn this into
      // a boolean, because the currentUser object (maybe) has some recursive
      // structure that foils QUnit's eager generation of its failure message
      assert.ok(!!resultForSession.currentUser, 'sets currentUser on session');
      assert.equal(Ember.get(resultForSession, 'currentUser.username'), userEmail, 'user email is from the API');
      assert.equal(Ember.get(resultForSession, 'token.id'), tokenId, 'token is present with id');
    }).finally(done);
  });
});

test('#fetch fetches current_token, stores payload, set currentUser', function(assert){
  const done = assert.async();
  assert.expect(8);

  var adapter = this.subject({
    analytics: new MockAnalytics()
  });
  var token = 'some-token';
  var tokenId = 'some-token-id';
  var userId = 'some-user-id';
  var userUrl = '/some-user-url';
  var currentTokenUrl = '/current_token';
  var userEmail = 'some@email.com';
  var tokenUrl = '/some-token-url';

  stubRequest('get', currentTokenUrl, function(){
    return this.success({
      id: tokenId,
      access_token: token,
      _links: {
        user: {
          href: userUrl
        },
        self: {
          href: tokenUrl
        }
      }
    });
  });

  stubRequest('get', userUrl, function(){
    return this.success({
      id: userId,
      username: userEmail,
      email: userEmail
    });
  });

  assert.ok(!getAccessToken(), 'precond - no auth token');

  Ember.run(function(){
    adapter.fetch().then(function(resultForSession){
      assert.ok(true, 'session is opened with an auth_token');
      assert.equal(getAccessToken(), token, 'sets token on auth');

      // QUnit will hang forever if we don't explicitly turn this into
      // a boolean, because the currentUser object (maybe) has some recursive
      // structure that foils QUnit's eager generation of its failure message
      assert.ok(!!resultForSession.currentUser, 'sets currentUser on session');
      assert.equal(Ember.get(resultForSession, 'currentUser.username'), userEmail, 'user email is from the API');
      assert.equal(Ember.get(resultForSession, 'token.id'), tokenId, 'token is present with id');

      assert.equal(userIdForAnalytics, userId, 'User ID is used in analytics');
      assert.equal(userDataForAnalytics.email, userEmail, 'User email is used in analytics');
    }).finally(done);
  });
});

test('#fetch fetches current_token, stores payload, set currentUser, currentActor', function(assert){
  const done = assert.async();
  assert.expect(10);

  var adapter = this.subject({
    analytics: new MockAnalytics()
  });
  var token = 'some-token';
  var tokenId = 'some-token-id';
  var userId = 'some-user-id';
  var userUrl = '/some-user-url';
  var userEmail = 'some@email.com';
  var actorId = 'some-actor-id';
  var actorUrl = '/some-actor-id';
  var actorEmail = 'some@actor.com';
  var currentTokenUrl = '/current_token';
  var tokenUrl = '/some-token-url';

  stubRequest('get', currentTokenUrl, function(){
    return this.success({
      id: tokenId,
      access_token: token,
      _links: {
        user: {
          href: userUrl
        },
        actor: {
          href: actorUrl
        },
        self: {
          href: tokenUrl
        }
      }
    });
  });

  stubRequest('get', userUrl, function(){
    return this.success({
      id: userId,
      username: userEmail,
      email: userEmail
    });
  });

  stubRequest('get', actorUrl, function(){
    return this.success({
      id: actorId,
      username: actorEmail,
      email: actorEmail
    });
  });

  assert.ok(!getAccessToken(), 'precond - no auth token');

  Ember.run(function(){
    adapter.fetch().then(function(resultForSession){
      assert.ok(true, 'session is opened with an auth_token');
      assert.equal(getAccessToken(), token, 'sets token on auth');

      // See comment in test above regarding coercion to boolean.
      assert.ok(!!resultForSession.currentUser, 'sets currentUser on session');
      assert.ok(!!resultForSession.currentActor, 'sets currentActor on session');
      assert.equal(Ember.get(resultForSession, 'currentUser.username'), userEmail, 'user email is from the API');
      assert.equal(Ember.get(resultForSession, 'currentActor.username'), actorEmail, 'actor email is from the API');
      assert.equal(Ember.get(resultForSession, 'token.id'), tokenId, 'token is present with id');
      assert.equal(userIdForAnalytics, actorId, 'Actor ID is used in analytics');
      assert.equal(userDataForAnalytics.email, actorEmail, 'Actor email is used in analytics');
    }).finally(done);
  });
});
