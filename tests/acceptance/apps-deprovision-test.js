import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: App Deprovision', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('/apps/:id/deprovision requires authentication', function(){
  expectRequiresAuthentication('/apps/1/deprovision');
});

test('/apps/:id/deprovision will not deprovision without confirmation', function(){
  var appId = 1;
  var appName = 'foo-bar';

  stubApp({
    id: appId,
    handle: appName
  });

  signInAndVisit('/apps/'+appId+'/deprovision');
  andThen(function(){
    var button = findWithAssert('button:contains(Deprovision)');
    ok(button.is(':disabled'), 'deprovision button is disabled');
  });
});

test('/apps/:id/deprovision will deprovision with confirmation', function(){
  var appId = 1;
  var appName = 'foo-bar';
  var didDeprovision = false;

  stubStack({id: '1'});

  stubApp({
    id: appId,
    handle: appName,
    _links: {
      account: {href: '/accounts/1'}
    }
  });

  stubRequest('post', '/apps/'+appId+'/operations', function(request){
    didDeprovision = true;
    return this.success({
      id: '1',
      status: 'queued',
      type: 'deprovision'
    });
  });

  stubStacks();

  signInAndVisit('/apps/'+appId+'/deprovision');
  fillIn('input[type=text]', appName);
  andThen(function(){
    $('input[type=text]').trigger('input');
  });
  click('button:contains(Deprovision)');
  andThen(function(){
    ok(didDeprovision, 'deprovisioned');
    equal(currentPath(), 'stacks.stack.apps.index');
  });
});

test('/apps/:id/deprovision will show deprovision error', function(){
  var appId = 1;
  var appName = 'foo-bar';
  var errorMessage = 'Some bad error';

  stubStack({id: '1'});

  stubApp({
    id: appId,
    handle: appName,
    _links: {
      account: {href: '/accounts/1'}
    }
  });

  stubRequest('post', '/apps/'+appId+'/operations', function(request){
    return this.error(401, {
      code: 401,
      error: 'invalid_credentials',
      message: errorMessage
    });
  });

  signInAndVisit('/apps/'+appId+'/deprovision');
  fillIn('input[type=text]', appName);
  andThen(function(){
    $('input[type=text]').trigger('input');
  });
  click('button:contains(Deprovision)');
  andThen(function(){
    var error = findWithAssert('.alert');
    ok(error.text().indexOf(errorMessage) > -1, 'error message shown');
    equal(currentPath(), 'app.deprovision');
  });
});
