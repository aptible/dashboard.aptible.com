import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
let url = '/stacks/my-stack-1/certificates/new';
let stackId = 'my-stack-1';
let stackHandle = 'my-stack-1';

module('Acceptance: Certificate Create', {
  beforeEach: function() {
    App = startApp();
    stubStacks();
    stubStack({
      id: stackId,
      handle: stackHandle,
      _links: {
        certificates: { href: `/accounts/${stackId}/certificates` },
        organization: { href: '/organizations/1' }
      }
    });
    stubOrganization();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test(`${url} requires authentication`, function() {
  expectRequiresAuthentication(url);
});


test(`visiting ${url} and creating new certificate`, function(assert) {
  let cert = 'my cert';
  let pKey = 'my private key';

  stubRequest('get', '/accounts/my-stack-1/certificates', function(){
    return this.success({
      _links: {},
      _embedded: {
        certificates: []
      }
    });
  });

  stubRequest('get', '/accounts/my-stack-1/apps', function(){
    return this.success({
      _links: {},
      _embedded: {
        apps: []
      }
    });
  });

  stubRequest('post', '/accounts/my-stack-1/certificates', function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to correct URL');
    assert.equal(json.certificate_body, cert);
    assert.equal(json.private_key, pKey);

    return this.success({ common_name: 'health.io', certificate_body: cert, private_key: pKey});
  });


  stubStacks({ includeApps: false });
  stubStack({ id: stackId });
  stubOrganization();
  stubOrganizations();

  signInAndVisit(url);
  andThen(function(){
    assert.equal(currentPath(), 'enclave.stack.certificates.new');
    fillInput('body', cert);
    fillInput('private-key', pKey);
    clickButton('Save Certificate');
  });

  andThen(function() {
    assert.equal(currentPath(), 'enclave.stack.certificates.index');
  });
});