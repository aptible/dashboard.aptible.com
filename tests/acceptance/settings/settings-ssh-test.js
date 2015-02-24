import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

var settingsUrl = '/settings';
var settingsSshUrl = settingsUrl + '/ssh';
var userId = 'user1'; // from signInAndVisit helper
var userEmail = 'stubbed-user@gmail.com'; // from signInAndVisit helper
var userName = 'stubbed user'; // from signInAndVisit helper

var userApiUrl = '/users/' + userId;

module('Acceptance: User Settings: Ssh', {
  setup: function() {
    App = startApp();
    stubStacks();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

function stubGetKeys(keys){
  stubRequest('get', '/users/user1/ssh_keys', function(){
    return this.success({
      _embedded: {
        ssh_keys: keys
      }
    });
  });
}

function addButton(){
  return find('button:contains(Add another SSH key)');
}

function addFirstButton(){
  return findWithAssert('button:contains(Add your first SSH key)');
}

function deleteButton(){
  return findWithAssert('a.delete-key');
}

function saveKeyButton(){
  return find('button:contains(Save new SSH key)');
}

function nevermindButton(){
  return findWithAssert('button:contains(Nevermind)');
}

function nameInput(){
  return findWithAssert('input[name="name"]');
}

function publicKeyInput(){
  return findWithAssert('textarea[name="ssh-public-key"]');
}

test(settingsSshUrl + ' requires authentication', function(){
  expectRequiresAuthentication(settingsSshUrl);
});

test('visit ' + settingsSshUrl + ' shows ssh keys', function(){
  var keys = [
    {id: 1, name: 'key1', public_key_fingerprint: '3b:55:f2:c6:4f'},
    {id: 2, name: 'key2', public_key_fingerprint: '4b:56:f3:c7:5f'}
  ];

  stubGetKeys(keys);
  signInAndVisit(settingsSshUrl);

  andThen(function(){
    ok( find('h3:contains(SSH Keys)').length,
        'has header' );

    equal( find('.ssh-key-item').length, keys.length,
           'has ' + keys.length + ' ssh keys');

    ok( addButton().length, 'has add button');
    equal(deleteButton().length, keys.length,
          'has ' + keys.length + ' delete buttons');

    click(addButton());
  });

  andThen(function(){
    ok(nameInput().length, 'has name input');
    ok(publicKeyInput().length, 'has ssh-public-key input');
    ok( saveKeyButton().length, 'has save key button' );
    ok( nevermindButton().length, 'has cancel button' );
    ok(!addButton().length, 'does not show add button when adding a key');
  });
});

test('visit ' + settingsSshUrl + ' with no key shows button to add key', function(){
  stubGetKeys([]);
  signInAndVisit(settingsSshUrl);

  andThen(function(){
    ok( addFirstButton().length, 'has Add First button');
  });
});

test('visit ' + settingsSshUrl + ' allows adding a key', function(){
  expect(4);

  stubGetKeys([]);

  var keyName   = "my-test-key";
  var publicKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC90B4...";

  stubRequest('post', '/users/user1/ssh_keys', function(request){
    var json = this.json(request);

    equal(json.name, keyName);
    equal(json.ssh_public_key, publicKey);

    return this.success({
      id: 'ssh-key-id',
      name: json.name,
      ssh_public_key: json.ssh_public_key,
      public_key_fingerprint: "07:04:3a:1d:0c:9c:60:1a:09:70:4b:ca:f9:89:a3:e5"
    });
  });

  signInAndVisit(settingsSshUrl);

  andThen(function(){
    click( addFirstButton() );
  });

  andThen(function(){
    click( nevermindButton() );
  });

  andThen(function(){
    ok( !saveKeyButton().length, 'save button is not shown after cancel' );
    click( addFirstButton() );
  });

  andThen(function(){
    fillIn( nameInput(), keyName );
    fillIn( publicKeyInput(), publicKey);
    click( saveKeyButton() );
  });

  andThen(function(){
    ok( find('.ssh-key-item:contains(' + keyName + ')').length,
        'shows key with name: ' + keyName);
  });
});

test('visit ' + settingsSshUrl + ' and adding a key when it returns an error', function(){
  stubGetKeys([]);

  var keyName = "my-test-key";
  var publicKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC90B4...";

  stubRequest('post', '/users/user1/ssh_keys', function(request){
    return this.error({
      message: 'The key is invalid'
    });
  });

  signInAndVisit(settingsSshUrl);

  andThen(function(){
    click( addFirstButton() );
    fillIn( nameInput(), keyName );
    fillIn( publicKeyInput(), publicKey );

    click('button:contains(Save new SSH key)');
  });

  andThen(function(){
    var error = find('.alert');
    ok( error.length, 'error div is shown');

    ok( error.text().indexOf('The key is invalid') > -1,
        'displays error text' );
  });
});

test('visit ' + settingsSshUrl + ' and delete a key', function(){
  expect(2);

  var keys = [
    {id: 1, name: 'key1', public_key_fingerprint: '3b:55:f2:c6:4f'}
  ];
  var deleteUrl = '/ssh_keys/1';

  stubGetKeys(keys);

  stubRequest('delete', deleteUrl, function(){
    ok(true, 'calls DELETE ' + deleteUrl);
    return this.success({id:1});
  });

  signInAndVisit(settingsSshUrl);

  andThen(function(){
    click( deleteButton() );
  });

  andThen(function(){
    equal( find('.ssh-key-item').length, 0,
           'after deleting, 0 keys are shown');
  });
});
