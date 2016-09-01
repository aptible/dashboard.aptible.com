// click button -> save vhost, create reprovision operation

import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

let appId = '1';
let appHandle = 'app-handle';
let vhostId = 'vhost-id';
let virtualDomain = 'health.io';
let serviceId = 'abc-service-id';
let serviceUrl = `/services/${serviceId}`;
let serviceHandle = 'abc-service-handle';
let vhostsUrl = `/apps/${appId}/vhosts`;

let url = `/apps/${appId}/vhosts/${vhostId}/edit`;

module('Acceptance: App Endpoint Edit', {
  beforeEach: function() {
    App = startApp();
    stubStacks();
    stubOrganizations();
    stubApp({
      id: appId,
      handle: appHandle,
      _links: { vhosts: { href: vhostsUrl } }
    });

    let vhostData = {
      id: vhostId,
      status: 'provisioned',
      virtual_domain: virtualDomain,
      _links: {
        service: { href: serviceUrl },
        certificate: { href: '/certificates/my-cert-1' }
      }
    };

    stubRequest('get', '/certificates/my-cert-1', function() {
      return this.success({ id: 'my-cert-1', 'common_name': virtualDomain,
                            certificate_body: 'my cert', private_key: 'private key'});
    });

    stubRequest('get', vhostsUrl, function(){
      return this.success({
        _embedded: {
          vhosts: [vhostData]
        }
      });
    });

    stubRequest('get', serviceUrl, function(){
      return this.success({
        id: serviceId,
        handle: serviceHandle
      });
    });
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test(`visit ${url} shows form with certificates`, function(assert) {
  let stackId = 'stubbed-stack';

  stubRequest('get', `/accounts/${stackId}/certificates`, function(){
    return this.success({
      _links: {},
      _embedded: {
        certificates: [
          { id: 'cert-1', certificate_body: 'cert_body',
            private_key: 'private_key', common_name: '*.health.io',
            issuer_organization: 'DigiCert', not_before: '2014-10-29T00:00:00.000Z',
            not_after: '2017-01-21T12:00:00.000Z' },
          { id: 'cert-2', certificate_body: 'cert_body2',
            private_key: 'private_key2', common_name: 'health.io',
            issuer_organization: 'DigiCert', not_before: '2014-10-29T00:00:00.000Z',
            not_after: '2017-01-21T12:00:00.000Z' }
        ]
      }
    });
  });

  stubStack({
    id: stackId,
    _links: { certificates: { href: `/accounts/${stackId}/certificates` }}
  });

  signInAndVisit(url);
  andThen( () => {
    assert.equal(currentPath(), 'enclave.app.vhosts.edit');
    expectTitle(`Edit ${virtualDomain} - ${appHandle}`);
    assert.equal(find('.panel-heading h3').text(), `Edit ${virtualDomain}`);

    let serviceInput = findInput('service');
    assert.ok(serviceInput.length, 'has service input');
    assert.ok(serviceInput.is(':disabled'), 'service is disabled');
    assert.equal(serviceInput.find('option:first').val(), serviceHandle);

    let certificateInput = findInput('certificate');
    assert.ok(certificateInput.length, 'has certificate input');
    assert.equal(certificateInput.find('option:first').text(), '*.health.io - Valid: October 29, 2014-January 21, 2017 - Issued by: DigiCert');
    assert.equal(certificateInput.find('option:first').val(), 'cert-1');

    assert.ok(!findInput('certificate-body').length, 'has no certificate body field');
    assert.ok(!findInput('private-key').length, 'has no private key field');

    expectButton('Save Endpoint');
    expectButton('Cancel');
  });
});

test(`visit ${url} shows form without certificates`, function(assert) {
  let stackId = 'stubbed-stack';

  stubRequest('get', `/accounts/${stackId}/certificates`, function(){
    return this.success({
      _embedded: { certificates: [] }
    });
  });

  stubStack({
    id: stackId,
    _links: { certificates: { href: `/accounts/${stackId}/certificates` }}
  });

  signInAndVisit(url);
  andThen( () => {
    assert.equal(currentPath(), 'enclave.app.vhosts.edit');
    expectTitle(`Edit ${virtualDomain} - ${appHandle}`);
    assert.equal(find('.panel-heading h3').text(), `Edit ${virtualDomain}`);

    let serviceInput = findInput('service');
    assert.ok(serviceInput.length, 'has service input');
    assert.ok(serviceInput.is(':disabled'), 'service is disabled');
    assert.equal(serviceInput.find('option:first').val(), serviceHandle);

    assert.ok(!findInput('certificate').length, 'has no certificate select box');

    expectInput('certificate-body');
    assert.equal(findInput('certificate-body').val(), '',
          'certificate is empty');
    expectInput('private-key');
    assert.equal(findInput('private-key').val(), '',
          'private key is empty');

    expectButton('Save Endpoint');
    expectButton('Cancel');
  });
});

test(`visit ${url} click save`, function(assert) {
  stubStack({id: 'stubbed-stack'});
  assert.expect(10);

  let newCert = 'abc-new-cert';
  let newPk = 'abc-new-pk';
  let certificateId = 'my-cert-1;';
  let certificateHref = `/certificates/${certificateId}`;

  stubRequest('post', '/accounts/stubbed-stack/certificates', function() {
    assert.ok(true, 'creates a new certificate');
    return this.success({ id: certificateId, common_name: 'health.io',
                          _links: { self: { href: certificateHref }}});
  });

  stubRequest('put', `/vhosts/${vhostId}`, function(request){
    assert.ok(true, 'posts to create endpoint');
    let json = this.json(request);
    assert.equal(json.certificate, certificateHref);

    return this.success(Ember.merge(json, {id:vhostId, status: 'provisioned' }));
  });

  stubRequest('get', `/vhosts/${vhostId}`, function(request){
    assert.ok(true, 'reloads the updated endpoint');
    let json = this.json(request);
    return this.success(Ember.merge(json, {id:vhostId, status: 'provisioned' }));
  });


  stubRequest('post', `/vhosts/${vhostId}/operations`, function(request){
    assert.ok(true, 'posts to create endpoint operation');
    let json = this.json(request);

    assert.equal(json.type, 'provision');
    assert.ok(!json.certificate, 'doesn\'t pass a certificate');
    assert.ok(!json.private_key, 'doesn\'t pass a private key');

    return this.success({
      id: 'new-op-id',
      type: json.type
    });
  });

  signInAndVisit(url);
  andThen( () => {
    fillIn(findInput('certificate-body'), newCert);
    fillIn(findInput('private-key'), newPk);

    click(findButton('Save Endpoint'));
  });

  andThen( () => {
    assert.equal(currentPath(), 'enclave.app.vhosts.index');

    assert.ok( find(`.vhost .vhost-virtualdomain:contains(health.io)`).length,
        'shows new endpoint health.io');
  });
});

test(`visit ${url} click save and error`, function(assert) {
  let stackId = 'stubbed-stack';
  let errorMsg = 'There was an error with this endpoint';

  stubRequest('get', `/accounts/${stackId}/certificates`, function(){
    return this.success({ _embedded: { certificates: [] } });
  });

  stubStack({
    id: stackId,
    _links: { certificates: { href: `/accounts/${stackId}/certificates` }}
  });

  stubRequest('post', '/accounts/stubbed-stack/certificates', function() {
    return this.success({ id: 'my-cert', common_name: 'www.health.io' });
  });

  stubRequest('put', `/vhosts/${vhostId}`, function(){
    return this.error({
      message: errorMsg
    });
  });

  signInAndVisit(url);

  andThen( () => {
    click(findButton('Save Endpoint'));
  });

  andThen( () => {
    assert.equal(currentPath(), 'enclave.app.vhosts.edit');

    assert.ok(find('.alert').length, 'has error div');
    assert.ok(find('.alert').text().indexOf(errorMsg) > -1,
       `shows error message "${errorMsg}"`);
  });
});

test(`visit ${url} and click cancel`, function(assert) {
  let stackId = 'stubbed-stack';
  let newVirtualDomain = 'aptible.com';
  let cert = { id: 'cert-1', certificate_body: 'cert_body',
               private_key: 'private_key', common_name: newVirtualDomain };

  stubRequest('get', `/accounts/${stackId}/certificates`, function(){
    return this.success({ _embedded: { certificates: [cert] } });
  });

  stubStack({
    id: stackId,
    _links: { certificates: { href: `/accounts/${stackId}/certificates` }}
  });

  signInAndVisit(url);
  andThen( () => {
    clickButton('Cancel');
  });

  andThen( () => {
    assert.equal(currentPath(), 'enclave.app.vhosts.index');
    assert.ok(!find(`.vhost .vhost-virtualdomain:contains(${newVirtualDomain})`).length,
       `does not show new virtual domain: "${newVirtualDomain}"`);
    assert.ok(find(`.vhost .vhost-virtualdomain:contains(${virtualDomain})`).length,
       `does show old virtual domain "${virtualDomain}"`);
  });
});

test(`visit ${url} and transition away`, function(assert) {
  stubStack({id: 'stubbed-stack'});
  let newVirtualDomain = 'new-virt.domain.com';

  signInAndVisit(url);
  andThen( () => {
    fillInput('certificate-body', 'my cert');
    visit(vhostsUrl);
  });

  andThen( () => {
    assert.equal(currentPath(), 'enclave.app.vhosts.index');

    assert.ok(!find(`.vhost .vhost-virtualdomain:contains(${newVirtualDomain})`).length,
       `does not show new virtual domain: "${newVirtualDomain}"`);
    assert.ok(find(`.vhost .vhost-virtualdomain:contains(${virtualDomain})`).length,
       `does show old virtual domain "${virtualDomain}"`);
  });
});
