import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;
let stackId = 'my-stack-1';
let url = `/stacks/${stackId}/certificates`;

module('Acceptance: Certificates', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, function(assert) {
  expectRequiresAuthentication(url);
});

test(`visiting ${url} with no certificates redirects to certificates new`, function(assert) {
  stubRequest('get', '/accounts/my-stack-1/certificates', function(request){
    return this.success({
      _links: {},
      _embedded: {
        certificates: []
      }
    });
  });

    stubRequest('get', '/accounts/my-stack-1/apps', function(request){
    return this.success({
      _links: {},
      _embedded: {
        apps: []
      }
    });
  });
  stubStacks({ includeApps: false });
  stubStack({ id: stackId });
  stubOrganization();
  stubOrganizations();

  signInAndVisit(url);
  andThen(function(){
    assert.equal(currentPath(), 'dashboard.stack.certificates.new');
  });
});

test(`visiting ${url} shows list of certificates`, function(assert) {
  let orgId = 1, orgName = 'Sprocket Co';
  let stackHandle = 'my-stack-1';

  stubRequest('get', '/accounts/my-stack-1/certificates', function(request){
    return this.success({
      _links: {},
      _embedded: {
        certificates: [
          { id: 'cert-1', body: 'cert_body', private_key: 'private_key', common_name: 'common_name' },
          { id: 'cert-2', body: 'cert_body2', private_key: 'private_key2', common_name: 'common_name2' }
        ]
      }
    });
  });

  // Just needed to stub /stack/my-stack-1/certificates
  stubStacks();
  stubStack({
    id: stackId,
    handle: stackHandle,
    _links: {
      certificates: { href: `/accounts/${stackId}/certificates` },
      organization: { href: `/organizations/${orgId}` }
    }
  });
  stubOrganization();
  stubOrganizations();

  signInAndVisit(url);

  andThen(function() {
    assert.equal(find('.panel.certificate').length, 2, '2 certificates');
  });
});