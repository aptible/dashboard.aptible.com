import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from "../helpers/fake-server";

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
  stubOrganization();
  visit('/');

  andThen(function() {
    equal(currentPath(), 'login');
  });
});


test('visiting / when logged in with more than one stacks redirects to stacks index page', function() {
  stubStacks();
  stubOrganization();
  stubOrganizations();
  signInAndVisit('/');

  andThen(function() {
    equal(currentPath(), 'stacks.index');
  });
});

test('visiting / when logged in with only one stack redirects to first stack page', function() {
  let stackId = 'my-stack-1';
  stubStacks({ includeApps: true });
  stubOrganizations();
  stubRequest('get', '/accounts', function(request){
    return this.success({
      id: stackId,
      handle: stackId,
      _links: {},
      _embedded: {
        accounts: [{
          _links: {
            self: { href: '...' },
            apps: { href: '/accounts/my-stack-1/apps' },
            databases: { href: '/accounts/my-stack-1/databases' },
            organization: { href: '/organizations/1' }
          },
          id: 'my-stack-1',
          handle: 'my-stack-1'
        }]
      }
    });
  });
  stubOrganization();
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

