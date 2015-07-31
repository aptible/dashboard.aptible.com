import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: LandingPage', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting / redirects to login page', function(assert) {
  stubStacks();
  stubOrganization();
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'login');
  });
});


test('visiting / when logged in with more than one stacks redirects to stacks index page', function(assert) {
  stubStacks();
  stubOrganization();
  stubOrganizations();
  signInAndVisit('/');

  andThen(function() {
    assert.equal(currentPath(), 'dashboard.stack.apps.index');
  });
});

test('visiting / when logged in with only one stack redirects to first stack page', function(assert) {
  let stackId = 'my-stack-1';
  stubStacks();
  stubOrganizations();
  stubRequest('get', '/accounts', function(){
    return this.success({
      id: stackId,
      handle: stackId,
      _embedded: {
        accounts: [{
          _links: {
            apps: { href: '/accounts/my-stack-1/apps' },
            databases: { href: '/accounts/my-stack-1/databases' },
            organization: { href: '/organizations/1' }
          },
          id: 'my-stack-1',
          handle: 'my-stack-1',
          activated: true
        }]
      }
    });
  });
  stubOrganization();
  signInAndVisit('/');

  andThen(function() {
    assert.equal(currentURL(), `/stacks/${stackId}/apps`);
    assert.equal(currentPath(), 'dashboard.stack.apps.index');

    expectLink(`stacks/${stackId}/databases`);
    expectLink(`stacks/${stackId}/logging`);
  });
});
