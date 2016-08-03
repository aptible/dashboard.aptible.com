import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;

let appId = '1';
let appHandle = 'my-app';

let stackId = 'my-stack-1';
let stackHandle = 'my-stack-1';

let serviceId = 'the-service-id';
let certificateId = 'my-cert-1';
let certificateHref = `/certificates/${certificateId}`;

let appVhostsUrl = '/apps/' + appId + '/vhosts';
let appVhostsApiUrl = '/apps/' + appId + '/vhosts';
let appVhostsNewUrl = '/apps/' + appId + '/vhosts/new';

module('Acceptance: App Endpoint New', {
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

function setupStubs(options) {
  options = options || {};
  if (options.withCertificates === undefined) { options.withCertificates = true; }
  if (options.withServiceDefaultVhost === undefined) { options.withServiceDefaultVhost = false; }
  if (options.withAppDefaultVhost === undefined) { options.withAppDefaultVhost = false; }
  if (options.sweetnessStackVersion === undefined) { options.sweetnessStackVersion = 'v2'; }

  stubRequest('get', `/accounts/${stackId}/certificates`, function(){
    return this.success({
      _links: {},
      _embedded: {
        certificates: (options.withCertificates ? [
          { id: 'cert-1', certificate_body: 'cert_body', private_key: 'private_key', common_name: '*.health.io', acme: false, _links: { self: { href: certificateHref }} },
          { id: 'cert-2', certificate_body: 'cert_body2', private_key: 'private_key2', common_name: 'health.io', acme: false },
          { id: 'acme-cert-1', certificate_body: 'acme_cert', private_key: 'acme_key', common_name: 'some.health.io', acme: true }
        ] : [])
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
    activated: true,
    sweetness_stack_version: options.sweetnessStackVersion
  });

  const vhosts = [];

  if (options.withServiceDefaultVhost) {
    vhosts.push({
      id: '1',
      service_id: serviceId,
      default: 'true'
    });
  }

  if (options.withAppDefaultVhost) {
    vhosts.push({
      id: '2',
      service_id: 'some-other-service',
      default: 'true'
    });
  }

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({
      _embedded: { vhosts: vhosts }
    });
  });

  stubRequest('get', `/apps/${appId}`, function() {
    return this.success({
      id: appId,
      handle: appHandle,
      _embedded: {
        services: [{ // Must have at least 1 service so that there is a service selected in the dropdown
          id: serviceId,
          handle: 'the-hubot-service',
          _links: {
            account: { href: `/accounts/${stackId}` }
          }
        }]
      },
      _links: {
        vhosts: { href: appVhostsApiUrl },
        account: { href: `/accounts/${stackId}` }
      }
    });
  });
}

test('visit ' + appVhostsNewUrl + ' requires authentication', function() {
  expectRequiresAuthentication(appVhostsNewUrl);
});

test(`visiting ${appVhostsUrl} without any endpoints redirects to ${appVhostsNewUrl}`, function(assert) {
  setupStubs();
  signInAndVisit(appVhostsUrl);

  andThen(function() {
    assert.equal(currentPath(), 'dashboard.catch-redirects.app.vhosts.new');
  });
});

test(`visit ${appVhostsNewUrl} shows creation form`, function(assert) {
  setupStubs();

  signInAndVisit(appVhostsNewUrl);

  andThen(function(){
    assert.ok(find('.panel-heading:contains(Create a New Endpoint)').length,
       'has header');
    expectInput('service', {input:'select'});
    expectFocusedInput('service', {input:'select'});
    expectInput('domain-type', {input:'radio'});
    expectButton('Save Endpoint');
    expectButton('Cancel');
    expectTitle(`Add an endpoint - ${appHandle} - ${stackHandle}`);
  });
});

test(`visit ${appVhostsNewUrl} shows creation form with existing certificates`, function(assert) {
  setupStubs();

  signInAndVisit(appVhostsNewUrl);

  andThen(() => {
    expectFocusedInput('service', {input:'select'});
  });

  andThen(() => {
    click(findWithAssert('label:contains(custom certificate)'));
  });

  andThen(function(){
    assert.ok(find('.panel-heading:contains(Create a New Endpoint)').length,
       'has header');
    expectInput('domain-type', {input:'radio'});
    expectInput('service', {input:'select'});
    expectInput('certificate', { input: 'select'});
    expectButton('Save Endpoint');
    expectButton('Cancel');

    assert.ok(!find('textarea[name="certificate-body"]').length, 'has no certificate body field');
    assert.ok(!find('textarea[name="private-key"]').length, 'has no private key field');
    expectTitle(`Add an endpoint - ${appHandle} - ${stackHandle}`);

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
  setupStubs({ withCertificates: false });

  signInAndVisit(appVhostsNewUrl);

  andThen(() => {
    expectFocusedInput('service', {input:'select'});
  });

  andThen(() => {
    click(findWithAssert('label:contains(custom certificate)'));
  });

  andThen(function(){
    assert.ok(find('.panel-heading:contains(Create a New Endpoint)').length,
       'has header');
    expectInput('domain-type', {input:'radio'});
    expectInput('service', {input:'select'});
    expectInput('certificate-body', {input:'textarea'});
    expectInput('private-key', {input:'textarea'});
    expectButton('Save Endpoint');
    expectButton('Cancel');
    expectTitle(`Add an endpoint - ${appHandle} - ${stackHandle}`);
  });
});

test(`visit ${appVhostsNewUrl} should remove certificate form if default endpoint is clicked`, function(assert) {
  setupStubs({ withCertificates: false });
  signInAndVisit(appVhostsNewUrl);

  andThen(() => {
    expectFocusedInput('service', {input:'select'});
  });

  andThen(() => {
    click(findWithAssert('label:contains(custom certificate)'));
  });

  Error.stackTraceLimit = 1000;
  andThen(function(){
    assert.ok(find('.panel-heading:contains(Create a New Endpoint)').length,
      'has header');

    expectInput('domain-type', {input:'radio'});
    expectInput('service', {input:'select'});
    expectInput('certificate-body', {input:'textarea'});
    expectInput('private-key', {input:'textarea'});
    expectButton('Save Endpoint');
    expectButton('Cancel');
    expectTitle(`Add an endpoint - ${appHandle} - ${stackHandle}`);
  });

  andThen(function(){
    click(findWithAssert('label:contains(default endpoint)'));
  });

  andThen(function(){
    expectNoInput('certificate-body', {input:'textarea'});
    expectNoInput('private-key', {input:'textarea'});
  });
});

test(`visit ${appVhostsNewUrl} shows creation form for app with existing default endpoint (on this service)`, function(assert) {
  setupStubs({ withCertificates: false, withServiceDefaultVhost: true });
  signInAndVisit(appVhostsNewUrl);

  andThen(function(){
    assert.ok(find('.panel-heading:contains(Create a New Endpoint)').length,
      'has header');

    findWithAssert('label:contains(Default endpoint unavailable)');
    expectInput('service', {input:'select'});
    expectFocusedInput('service', {input:'select'});
    expectInput('domain-type', {input:'radio'});
    expectNoInput('vhost-type', {input:'radio'});
    expectButton('Save Endpoint');
    expectButton('Cancel');
    expectTitle(`Add an endpoint - ${appHandle} - ${stackHandle}`);
  });
});

test(`visit ${appVhostsNewUrl} shows creation form for app with existing default endpoint (on other service)`, function(assert) {
  setupStubs({ withCertificates: false, withAppDefaultVhost: true });
  signInAndVisit(appVhostsNewUrl);

  andThen(function(){
    assert.ok(find('.panel-heading:contains(Create a New Endpoint)').length,
      'has header');

    findWithAssert('label:contains(Default endpoint unavailable)');
    expectInput('service', {input:'select'});
    expectFocusedInput('service', {input:'select'});
    expectInput('domain-type', {input:'radio'});
    expectNoInput('vhost-type', {input:'radio'});
    expectButton('Save Endpoint');
    expectButton('Cancel');
    expectTitle(`Add an endpoint - ${appHandle} - ${stackHandle}`);
  });
});

test(`visit ${appVhostsNewUrl} shows creation form for app on v1 stack`, function(assert) {
  setupStubs({ withCertificates: false, sweetnessStackVersion: 'v1' });
  signInAndVisit(appVhostsNewUrl);

  andThen(function(){
    assert.ok(find('.panel-heading:contains(Create a New Endpoint)').length,
      'has header');

    findWithAssert('label:contains(Managed HTTPS unavailable)');
    expectInput('service', {input:'select'});
    expectFocusedInput('service', {input:'select'});
    expectInput('domain-type', {input:'radio'});
    expectNoInput('certificate-body', {input:'textarea'});
    expectNoInput('private-key', {input:'textarea'});
    expectButton('Save Endpoint');
    expectButton('Cancel');
    expectTitle(`Add an endpoint - ${appHandle} - ${stackHandle}`);
  });
});

test(`visit ${appVhostsNewUrl} and create vhost with existing certificates`, function(assert) {
  assert.expect(5);

  const vhostId = 'new-vhost-id';

  setupStubs({ withCertificates: true });
  signInAndVisit(appVhostsNewUrl);

  // Note: This won't be hit unless something is wrong. It ensures that an
  // existing cert is being used (and not created) for this case.
  stubRequest('post', `/accounts/:stack-id/certificates`, function() {
    assert.ok(false, 'should not create a new certificate');
  });

  // Sometimes the id is 1 and other times its 'the-service-id'
  stubRequest('post', `/services/:service-id/vhosts`, function(request){
    let json = this.json(request);
    assert.equal(json.certificate, certificateHref);
    assert.equal(json.certificate_body, null);
    assert.equal(json.private_key, null);
    assert.equal(json.type, 'http_proxy_protocol');

    return this.success({id: vhostId});
  });

  stubRequest('post', `/vhosts/${vhostId}/operations`, function(request){
    let json = this.json(request);
    assert.equal(json.type, 'provision', 'posts provision operation');
    return this.success({id: 'new-op-id'});
  });

  signInAndVisit(appVhostsNewUrl);

  andThen(() => {
    click(findWithAssert('label:contains(custom certificate)'));
  });

  andThen(function(){
    clickButton('Save Endpoint');
  });
});

test(`visit ${appVhostsNewUrl} and create vhost with new certificate`, function(assert) {
  assert.expect(9);

  const vhostId = 'new-vhost-id';
  let hasCreatedCertificate = false;

  setupStubs({ withCertificates: false });
  signInAndVisit(appVhostsNewUrl);

  stubRequest('post', `/accounts/${stackId}/certificates`, function(request) {
    let json = this.json(request);
    assert.equal(json.certificate_body, 'my long cert');
    assert.equal(json.private_key, 'my long pk');
    assert.ok(true, 'creates certificate');
    hasCreatedCertificate = true;
    return this.success({ id: certificateId, common_name: 'www.health.io',
                          _links: { self: { href: certificateHref }}});
  });

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

  signInAndVisit(appVhostsNewUrl);

  andThen(() => {
    click(findWithAssert('label:contains(custom certificate)'));
  });

  andThen(function(){
    fillInput('certificate-body', 'my long cert');
    fillInput('private-key', 'my long pk');
    clickButton('Save Endpoint');
  });

  andThen(() => {
    assert.ok(hasCreatedCertificate, "created certificate");
  });
});

test(`visit ${appVhostsNewUrl} and create default endpoint`, function(assert) {
  assert.expect(6);

  const vhostId = 'new-vhost-id';

  setupStubs();
  signInAndVisit(appVhostsNewUrl);

  stubRequest('post', `/services/${serviceId}/vhosts`, function(request){
    let json = this.json(request);
    assert.equal(json.default, true, "Type is default");
    assert.equal(json.certificate, null);
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

  signInAndVisit(appVhostsNewUrl);

  andThen(() => {
    click(findWithAssert('label:contains(default endpoint)'));
  });

  andThen(function(){
    fillInput('domain-type', true);
    clickButton('Save Endpoint');
  });
});

test(`visit ${appVhostsNewUrl} and create managed endpoint`, function(assert) {
  assert.expect(10);

  const userDomainInputSelector = "input[type=text]";
  const userDomain = "some.domain.com";
  const vhostId = "new-vhost-id";

  setupStubs();
  signInAndVisit(appVhostsNewUrl);

  stubRequest("post", `/services/${serviceId}/vhosts`, function(request){
    let json = this.json(request);
    assert.equal(json.default, false, "Default is not set");
    assert.equal(json.certificate, null, "Certificate is NULL");
    assert.equal(json.certificate_body, null, "Certificate body is NULL");
    assert.equal(json.private_key, null, "Certificate key is NULL");
    assert.equal(json.type, "http_proxy_protocol", "Proxy protocol is set");
    assert.equal(json.user_domain, userDomain, "User domain is set");
    assert.equal(json.acme, true, "ACME is set");

    return this.success({id:vhostId});
  });

  stubRequest("post", `/vhosts/${vhostId}/operations`, function(request){
    let json = this.json(request);
    assert.equal(json.type, "provision", "posts provision operation");
    return this.success({id: "new-op-id"});
  });

  signInAndVisit(appVhostsNewUrl);

  andThen(() => {
    click(findWithAssert("label:contains(Managed HTTPS)"));
  });

  andThen(() => {
    const saveButton = findWithAssert("button:contains(Save Endpoint)");
    assert.ok(saveButton.attr("disabled"), "Save button is disabled");

    const userDomainInput = findWithAssert(userDomainInputSelector);
    const userDomainInputhasError = userDomainInput.parent(".form-group").attr("class").indexOf("has-error") > 0;
    assert.ok(userDomainInputhasError, "User Domain input has error");
  });

  andThen(() => {
    fillIn(findWithAssert(userDomainInputSelector), userDomain);
  });

  andThen(function(){
    fillInput("domain-type", true);
    clickButton("Save Endpoint");
  });
});

test(`visit ${appVhostsNewUrl} and create a new transitonal managed endpoint`, function(assert) {
  assert.expect(8);

  const userDomainInputSelector = "input[type=text]";
  const userDomain = "some.domain.com";
  const vhostId = "new-vhost-id";

  setupStubs({ withCertificates: true });
  signInAndVisit(appVhostsNewUrl);

  stubRequest('post', `/accounts/:stack-id/certificates`, function() {
    assert.ok(false, 'should not create a new certificate');
  });

  stubRequest("post", `/services/${serviceId}/vhosts`, function(request){
    let json = this.json(request);
    assert.equal(json.default, false, "Default is not set");
    assert.equal(json.certificate, certificateHref, "Certificate is provided");
    assert.equal(json.certificate_body, null, "Certificate body is NULL");
    assert.equal(json.private_key, null, "Certificate key is NULL");
    assert.equal(json.type, "http_proxy_protocol", "Proxy protocol is set");
    assert.equal(json.user_domain, userDomain, "User domain is set");
    assert.equal(json.acme, true, "ACME is set");

    return this.success({id:vhostId});
  });

  stubRequest("post", `/vhosts/${vhostId}/operations`, function(request){
    let json = this.json(request);
    assert.equal(json.type, "provision", "posts provision operation");
    return this.success({id: "new-op-id"});
  });

  signInAndVisit(appVhostsNewUrl);

  andThen(() => {
    click(findWithAssert("label:contains(Managed HTTPS)"));
  });

  andThen(() => {
    click(findWithAssert("label:contains(Use a transitional certificate)"));
    fillIn(findWithAssert(userDomainInputSelector), userDomain);
  });

  andThen(function(){
    fillInput("domain-type", true);
    clickButton("Save Endpoint");
  });
});
