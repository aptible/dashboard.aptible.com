import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;

let appId = '1';
let appVhostsUrl = '/apps/' + appId + '/vhosts';
let appVhostsApiUrl = '/apps/' + appId + '/vhosts';
let appVhostsNewUrl = '/apps/' + appId + '/vhosts/new';

module('Acceptance: App Vhost New', {
  beforeEach: function() {
    App = startApp();
    stubStacks();
    stubOrganizations();
    stubOrganization();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit ' + appVhostsNewUrl + ' requires authentication', function() {
  expectRequiresAuthentication(appVhostsNewUrl);
});

test(`visiting ${appVhostsUrl} without any Vhosts redirects to ${appVhostsNewUrl}`, function(assert) {
  stubStacks();
  stubApp({ id: appId });
  stubStack({ id: 'stubbed-stack' });
  signInAndVisit(appVhostsUrl);

  andThen(function() {
    assert.equal(currentPath(), 'dashboard.app.vhosts.new');
  });
});

test(`visit ${appVhostsNewUrl} shows creation form`, function(assert) {
  var appId = 1;
  var appHandle = 'whammo-com';
  var stackHandle = 'moop-com';
  stubStacks();

  stubApp({
    id: appId,
    handle: appHandle,
    _embedded: { services: [] },
    _links: {
      vhosts: { href: appVhostsApiUrl },
      account: { href: `/accounts/${stackHandle}` }
    }
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({
      _embedded: { vhosts: [] }
    });
  });

  stubStack({
    id: stackHandle,
    handle: stackHandle
  });

  signInAndVisit(appVhostsNewUrl);

  andThen(function(){
    assert.ok(find('.panel-heading:contains(Create a new VHost)').length,
       'has header');
    expectInput('service', {input:'select'});
    expectFocusedInput('service', {input:'select'});
    expectInput('certificate-body', {input:'textarea'});
    expectInput('private-key', {input:'textarea'});
    expectButton('Save VHost');
    expectButton('Cancel');
    expectTitle(`Add a domain - ${appHandle} - ${stackHandle}`);
  });
});

test(`visit ${appVhostsNewUrl} shows creation form with existing certificates`, function(assert) {
  let appId = 1;
  let appHandle = 'my-app';
  let serviceId = 'the-service-id';
  let stackId = 'my-stack-1';
  let stackHandle = 'my-stack-1';
  let certificateId = 'my-cert-1';
  let certificateHref = `/certificates/${certificateId}`;

  stubRequest('get', `/accounts/${stackId}/certificates`, function(){
    return this.success({
      _links: {},
      _embedded: {
        certificates: [
          { id: 'cert-1', certificate_body: 'cert_body', private_key: 'private_key', common_name: '*.health.io', _links: { self: { href: certificateHref }} },
          { id: 'cert-2', certificate_body: 'cert_body2', private_key: 'private_key2', common_name: 'health.io' }
        ]
      }
    });
  });

  stubStack({
    _links: {
      self: { href: `/accounts/${stackId}` },
      organization: { href: '/organizations/1' },
      certificates: { href: `/accounts/${stackId}/certificates` },
    },
    _embedded: {},
    id: stackId,
    handle: stackHandle,
    activated: true
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({
      _embedded: { vhosts: [] }
    });
  });

  stubRequest('get', `/apps/${appId}`, function() {
    return this.success({
      id: appId,
      handle: appHandle,
      _embedded: {
        services: [{ // Must have at least 1 service so that there is a service selected in the dropdown
          id: serviceId,
          handle: 'the-hubot-service'
        }]
      },
      _links: {
        vhosts: { href: appVhostsApiUrl },
        account: { href: `/accounts/${stackId}` }
      }
    });
  });

  signInAndVisit(appVhostsNewUrl);

  andThen(function(){
    assert.ok(find('.panel-heading:contains(Create a new VHost)').length,
       'has header');
    expectInput('service', {input:'select'});
    expectFocusedInput('service', {input:'select'});
    expectInput('certificate', { input: 'select'});
    expectButton('Save VHost');
    expectButton('Cancel');

    assert.ok(!find('textarea[name="certificate-body"]').length, 'has no certificate body field');
    assert.ok(!find('textarea[name="private-key"]').length, 'has no private key field');
    expectTitle(`Add a domain - ${appHandle} - ${stackHandle}`);

    let toggle = find('.toggle-new-certificate');
    toggle.click();
  });

  andThen(function() {
    expectInput('certificate-body', { input: 'textarea' });
    expectInput('private-key', { input: 'textarea' });

    assert.ok(!find('select[name="certificate"]').length, 'has no certificate select');
    assert.ok(find('.toggle-new-certificate:contains(Select exisisting certificate)'), 'toggle button changes text');
  });
});

test(`visit ${appVhostsNewUrl} shows creation form without certificates`, function(assert) {
  let appId = 1;
  let appHandle = 'my-app';
  let serviceId = 'the-service-id';
  let stackId = 'my-stack-1';
  let stackHandle = 'my-stack-1';

  stubRequest('get', `/accounts/${stackId}/certificates`, function(){
    return this.success({
      _links: {},
      _embedded: {
        certificates: []
      }
    });
  });

  stubStack({
    _links: {
      self: { href: `/accounts/${stackId}` },
      organization: { href: '/organizations/1' },
      certificates: { href: `/accounts/${stackId}/certificates` },
    },
    _embedded: {},
    id: stackId,
    handle: stackHandle,
    activated: true
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({
      _embedded: { vhosts: [] }
    });
  });

  stubRequest('get', `/apps/${appId}`, function() {
    return this.success({
      id: appId,
      handle: appHandle,
      _embedded: {
        services: [{ // Must have at least 1 service so that there is a service selected in the dropdown
          id: serviceId,
          handle: 'the-hubot-service'
        }]
      },
      _links: {
        vhosts: { href: appVhostsApiUrl },
        account: { href: `/accounts/${stackId}` }
      }
    });
  });

  signInAndVisit(appVhostsNewUrl);

  andThen(function(){
    assert.ok(find('.panel-heading:contains(Create a new VHost)').length,
       'has header');
    expectInput('service', {input:'select'});
    expectFocusedInput('service', {input:'select'});
    expectInput('certificate-body', {input:'textarea'});
    expectInput('private-key', {input:'textarea'});
    expectButton('Save VHost');
    expectButton('Cancel');
    expectTitle(`Add a domain - ${appHandle} - ${stackHandle}`);
  });
});

test(`visit ${appVhostsNewUrl} and create vhost with existing certificates`, function(assert) {
  assert.expect(5);

  let appId = 1;
  let serviceId = 'the-service-id';
  let vhostId = 'new-vhost-id';
  let stackId = 'my-stack-1';
  let certificateId = 'my-cert-1';
  let certificateHref = `/certificates/${certificateId}`;

  stubRequest('get', `/accounts/${stackId}/certificates`, function(){
    return this.success({
      _links: {},
      _embedded: {
        certificates: [
          { id: 'cert-1', certificate_body: 'cert_body', private_key: 'private_key', common_name: '*.health.io', _links: { self: { href: certificateHref }} },
          { id: 'cert-2', certificate_body: 'cert_body2', private_key: 'private_key2', common_name: 'health.io' }
        ]
      }
    });
  });

  stubStack({
    _links: {
      self: { href: `/accounts/${stackId}` },
      organization: { href: '/organizations/1' },
      certificates: { href: `/accounts/${stackId}/certificates` },
    },
    _embedded: {},
    id: stackId,
    handle: 'my-stack-1',
    activated: true
  });

  stubRequest('get', `/apps/${appId}`, function() {
    return this.success({
      id: appId,
      _embedded: {
        services: [{ // Must have at least 1 service so that there is a service selected in the dropdown
          id: serviceId,
          handle: 'the-hubot-service'
        }]
      },
      _links: {
        vhosts: { href: appVhostsApiUrl },
        account: { href: `/accounts/${stackId}` }
      }
    });
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({
      _embedded: { vhosts: [] }
    });
  });

  signInAndVisit(appVhostsNewUrl);

  // Note: This won't be hit unless something is wrong. It ensures that an
  // existing cert is being used (and not created) for this case.
  stubRequest('post', `/accounts/:stack-id/certificates`, function() {
    assert.ok(false, 'should not create a new certificate');
  });

  stubRequest('post', `/services/1/vhosts`, function(request){
    let json = this.json(request);
    assert.equal(json.certificate, certificateHref);
    assert.equal(json.certificate_body, null);
    assert.equal(json.private_key, null);
    assert.equal(json.type, 'http_proxy_protocol');

    return this.success({id:vhostId});
  });

  stubRequest('post', `/vhosts/${vhostId}/operations`, function(request){
    let json = this.json(request);
    assert.equal(json.type, 'provision', 'posts provision operation');
    return this.success({id: 'new-op-id'});
  });

  visit(appVhostsNewUrl);
  andThen(function(){
    clickButton('Save VHost');
  });
});

test(`visit ${appVhostsNewUrl} and create vhost with new certificate`, function(assert) {
  assert.expect(8);

  let appId = 1;
  let serviceId = 'the-service-id';
  let vhostId = 'new-vhost-id';
  let certificateId = 'my-cert-1';
  let certificateHref = `/certificates/${certificateId}`;

  stubApp({
    id: appId,
    _embedded: {
      services: [{ // Must have at least 1 service so that there is a service selected in the dropdown
        id: serviceId,
        handle: 'the-hubot-service'
      }]
    },
    _links: {
      vhosts: { href: appVhostsApiUrl }
    }
  });
  stubStack({ id: 'stubbed-stack' });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({
      _embedded: { vhosts: [] }
    });
  });

  stubRequest('post', '/accounts/stubbed-stack/certificates', function(request) {
    let json = this.json(request);
    assert.equal(json.certificate_body, 'my long cert');
    assert.equal(json.private_key, 'my long pk');
    assert.ok(true, 'creates certificate');
    return this.success({ id: certificateId, common_name: 'www.health.io',
                          _links: { self: { href: certificateHref }}});
  });

  signInAndVisit(appVhostsNewUrl);

  stubRequest('post', `/services/${serviceId}/vhosts`, function(request){
    let json = this.json(request);
    assert.equal(json.certificate, certificateHref);
    assert.equal(json.certificate_body, null);
    assert.equal(json.private_key, null);
    assert.equal(json.type, 'http_proxy_protocol');

    return this.success({id:vhostId});
  });

  stubRequest('post', `/vhosts/${vhostId}/operations`, function(request){
    let json = this.json(request);
    assert.equal(json.type, 'provision', 'posts provision operation');
    return this.success({id: 'new-op-id'});
  });

  visit(appVhostsNewUrl);
  andThen(function(){
    fillInput('certificate-body', 'my long cert');
    fillInput('private-key', 'my long pk');
    clickButton('Save VHost');
  });
});
