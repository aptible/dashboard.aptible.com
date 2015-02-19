import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from "./fake-server";

var App;

module('Acceptance: LandingPage', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting / redirects to login page', function() {
  stubStacks();
  visit('/');

  andThen(function() {
    equal(currentPath(), 'login');
  });
});


test('visiting / when logged in with more than one stacks redirects to stacks index page', function() {
  stubStacks();
  signInAndVisit('/');

  andThen(function() {
    equal(currentPath(), 'stacks.index');
  });
});

test('visiting / when logged in with only one stack redirects to first stack page', function() {
  let stackId = 'my-stack-1';
  stubStacks();
  stubRequest('get', '/accounts', function(request){
    return this.success({
      _links: {},
      _embedded: {
        accounts: [{
          _links: {
            self: { href: '...' },
            apps: { href: '/accounts/my-stack-1/apps' },
            databases: { href: '/accounts/my-stack-1/databases' }
          },
          id: 'my-stack-1',
          handle: 'my-stack-1'
        }]
      }
    });
  });
  signInAndVisit('/');

  andThen(function() {
    equal(currentURL(), `/stacks/${stackId}/apps`);
    equal(currentPath(), 'stack.apps.index');

    ok( find(`a[href*="stacks/${stackId}/databases"]`).length,
        'has link to databases');
    ok( find(`a[href*="stacks/${stackId}/logging"]`).length,
        'has link to databases');
  });
});

