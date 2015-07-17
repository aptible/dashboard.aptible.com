import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

var settingsUrl = '/settings';
var settingsSshUrl = settingsUrl + '/ssh';
// from signInAndVisit helper
var userId = 'user1';
// from signInAndVisit helper
var userEmail = 'stubbed-user@gmail.com';
// from signInAndVisit helper
var userName = 'stubbed user';

var userApiUrl = '/users/' + userId;

module('Acceptance: User Settings: Ssh', {
  beforeEach: function() {
    App = startApp();
    stubStacks();
  },
  afterEach: function() {
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

test(settingsSshUrl + ' requires authentication', function(assert) {
  expectRequiresAuthentication(settingsSshUrl);
});

test('visit ' + settingsSshUrl + ' shows ssh keys', function(assert) {
  var keys = [
    {id: 1, name: 'key1', public_key_fingerprint: '3b:55:f2:c6:4f'},
    {id: 2, name: 'key2', public_key_fingerprint: '4b:56:f3:c7:5f'}
  ];

  stubGetKeys(keys);

  signInAndVisit(settingsSshUrl);
  andThen(function(){
    assert.ok( find('h3:contains(SSH Keys)').length,
        'has header' );

    assert.equal( find('.ssh-key-item').length, keys.length,
           'has ' + keys.length + ' ssh keys');

    expectButton('Add another SSH key');

    let deleteButton = findButton('Delete SSH Key');
    assert.equal(deleteButton.length, keys.length,
          'has ' + keys.length + ' delete buttons');
  });
  clickButton('Add another SSH key');

  andThen(function(){
    expectInput('name');
    expectInput('ssh-public-key');
    expectButton('Save new SSH key');
    expectButton('Cancel');

    let addButton = findButton('Add another SSH key');
    assert.ok(!addButton.length, 'does not show add button when adding a key');
  });
});

test('visit ' + settingsSshUrl + ' with no key shows button to add key', function(assert) {
  stubGetKeys([]);
  signInAndVisit(settingsSshUrl);

  andThen(function(){
    expectButton('Add your first SSH key');
  });
});

test('visit ' + settingsSshUrl + ' allows adding a key', function(assert) {
  assert.expect(4);

  stubGetKeys([]);

  var keyName   = "my-test-key";
  var publicKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC90B4...";

  stubRequest('post', '/users/user1/ssh_keys', function(request){
    var json = this.json(request);

    assert.equal(json.name, keyName);
    assert.equal(json.ssh_public_key, publicKey);

    return this.success({
      id: 'ssh-key-id',
      name: json.name,
      ssh_public_key: json.ssh_public_key,
      public_key_fingerprint: "07:04:3a:1d:0c:9c:60:1a:09:70:4b:ca:f9:89:a3:e5"
    });
  });

  signInAndVisit(settingsSshUrl);
  clickButton('Add your first SSH key');
  clickButton('Cancel');
  andThen(function(){
    let saveButton = findButton('Save new SSH key');
    assert.ok( !saveButton.length, 'save button is not shown after cancel' );
  });
  clickButton('Add your first SSH key');
  fillInput('name', keyName);
  fillInput('ssh-public-key', publicKey);
  clickButton('Save new SSH key');
  andThen(function(){
    assert.ok( find('.ssh-key-item:contains(' + keyName + ')').length,
        'shows key with name: ' + keyName);
  });
});

test('visit ' + settingsSshUrl + ' and adding a key when it returns an error', function(assert) {
  stubGetKeys([]);

  var keyName = "my-test-key";
  var publicKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC90B4...";

  stubRequest('post', '/users/user1/ssh_keys', function(request){
    return this.error({
      message: 'The key is invalid'
    });
  });

  signInAndVisit(settingsSshUrl);
  clickButton('Add your first SSH key');
  fillInput('name', keyName );
  fillInput('ssh-public-key', publicKey );
  clickButton('Save new SSH key');
  andThen(function(){
    var error = find('.alert');
    assert.ok( error.length, 'error div is shown');

    assert.ok( error.text().indexOf('The key is invalid') > -1,
        'displays error text' );
  });
});

test('visit ' + settingsSshUrl + ' and delete a key', function(assert) {
  assert.expect(2);

  var keys = [
    {id: 1, name: 'key1', public_key_fingerprint: '3b:55:f2:c6:4f'}
  ];
  var deleteUrl = '/ssh_keys/1';

  stubGetKeys(keys);

  stubRequest('delete', deleteUrl, function(){
    assert.ok(true, 'calls DELETE ' + deleteUrl);
    return this.success({id:1});
  });

  signInAndVisit(settingsSshUrl);
  clickButton('Delete SSH Key');
  andThen(function(){
    assert.equal( find('.ssh-key-item').length, 0,
           'after deleting, 0 keys are shown');
  });
});

test(`visiting ${settingsSshUrl} as unverified user shows verification message`, function(assert) {
  stubGetKeys([]);
  let userData = {verified: false};
  stubOrganization();
  stubOrganizations();
  signInAndVisit(settingsSshUrl, userData);

  andThen(() => {
    expectNoButton('Add your first SSH key');
    expectNoButton('Add another SSH key');

    let message = find('.activate-notice h1');
    assert.ok(message.text().indexOf('Confirm your email') > -1,
       'shows unverified user message');
  });
});
