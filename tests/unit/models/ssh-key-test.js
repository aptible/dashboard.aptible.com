import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from "../../helpers/fake-server";
import Ember from 'ember';

moduleForModel('ssh-key', 'SshKey', {
  // Specify the other units that are required for this test.
  needs: [
    'model:role',
    'model:organization',
    'model:user',
    'model:token',

    'adapter:application',
    'adapter:ssh-key',
    'adapter:user',
    'serializer:application',
  ]
});

/*
test('can FIND ssh-key by id', function(){
  var store = this.store();

  stubRequest('get', '/ssh_keys/1', function(){
    return this.success({
      id: '1'
    });
  });

  return Ember.run(function(){
    return store.find('ssh-key',1).then(function(key){
      ok(!!key, 'finds key');
      equal(key.get('id'),'1','has id');
    });
  });
});


test('when creating an sshKey for a user, POSTs to /users/:user_id/ssh_keys', function(){
  expect(6);

  var store = this.store();

  var key, user;
  var userId = 'my-user-id';
  var keyName = 'the-key';
  var sshPublicKey = 'rsa-ssh ABCSDFWEFSGS';


  Ember.run(function(){
    user = store.createRecord('user', {id: userId});
    key = store.createRecord('ssh-key', {
      name: keyName,
      sshPublicKey: sshPublicKey,
      user: user
    });
  });

  stubRequest('post', '/users/' + userId + '/ssh_keys', function(request){
    ok(true, 'posts to correct url');
    var json = JSON.parse(request.requestBody);

    equal(json.name, keyName, 'has key name in json');
    equal(json.ssh_public_key, sshPublicKey, 'has public_ssh_key in json');

    return this.success({
      id: 'key-id',
      name: keyName,
      public_key_fingerprint: 'abcdef'
    });
  });

  return Ember.run(function(){
    return key.save().then(function(){
      ok(true, 'key saved');

      equal(key.get('id'), 'key-id', 'key has correct id');
      equal(key.get('publicKeyFingerprint'), 'abcdef', 'key has fingerprint');
    }).catch(function(e){
      console.log('error:',e);
      ok(false, 'error:'+e);
    });
  });
});
*/
