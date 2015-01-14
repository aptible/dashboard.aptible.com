import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: Stack Settings', {
  setup: function() {
    App = startApp();
    stubStacks();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /stacks/1/settings requires authentication', function(){
  expectRequiresAuthentication('/stacks/1/settings');
});

test('visit /stacks/:id/settings', function(){
  var stackName = 'Cool Stack';
  stubStack({id:1, name:stackName});

  signInAndVisit('/stacks/1/settings');

  andThen(function(){
    equal(currentPath(), 'stacks.stack.settings');

    var nameInput       = find('input[name="name"]');
    var syslogHostInput = find('input[name="syslog-host"]');
    var syslogPortInput = find('input[name="syslog-port"]');

    ok(nameInput.length, 'has input for name');
    ok(syslogHostInput.length, 'has input for syslog host');
    ok(syslogPortInput.length, 'has input for syslog port');

    var cancelButton = find('button:contains(Nevermind)');
    var okButton = find('button:contains(Update account)');

    ok(cancelButton.length, 'has cancel button');
    ok(okButton.length, 'has ok button');
  });
});

test('visit /stacks/:id/settings and save changes', function(){
  expect(4);

  stubStack({id:1, name:'Cool Stack'});

  var newName = 'cool stack v2', newHost = 'cool.stack.com', newPort = '199';

  signInAndVisit('/stacks/1/settings');
  fillIn('input[name="name"]', newName);
  fillIn('input[name="syslog-host"]', newHost);
  fillIn('input[name="syslog-port"]', newPort);

  stubRequest('put', '/accounts/1', function(request){
    var json = this.json(request);

    equal(json.name, newName, 'JSON has new name');
    equal(json.syslog_host, newHost, 'JSON has new host');
    equal(json.syslog_port, newPort, 'JSON has new port');

    return this.success({id:1, name:newName, syslog_host:newHost, syslog_port:newPort});
  });

  click('button:contains(Update account)');

  andThen(function(){
    equal(currentPath(), 'stacks.stack.apps.index',
          'redirects to apps index after change');
  });
});

test('visit /stacks/:id/settings and click cancel', function(){
  expect(1);

  stubStack({id:1, name:'Cool Stack'});

  signInAndVisit('/stacks/1/settings');

  fillIn('input[name="name"]', 'incorrect name');
  click('button:contains(Nevermind)');

  andThen(function(){
    equal(currentPath(), 'stacks.stack.apps.index');
  });
});

