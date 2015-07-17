// click button -> save vhost, create reprovision operation

import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

let appId = '1';
let appHandle = 'app-handle';
let vhostId = 'vhost-id';
let virtualDomain = 'abc.virtual-domain.com';
let serviceId = 'abc-service-id';
let serviceUrl = `/services/${serviceId}`;
let serviceHandle = 'abc-service-handle';
let vhostsUrl = `/apps/${appId}/vhosts`;

let url = `/apps/${appId}/vhosts/${vhostId}/edit`;

module('Acceptance: App Vhost Edit', {
  beforeEach: function() {
    App = startApp();
    stubApp({
      id: appId,
      handle: appHandle,
      _links: { vhosts: { href: vhostsUrl } }
    });

    let vhostData = {
      id: vhostId,
      certificate: 'abccert',
      private_key: 'abc-pk',
      status: 'provisioned',
      virtual_domain: virtualDomain,
      _links: {
        service: { href: serviceUrl }
      }
    };

    stubRequest('get', vhostsUrl, function(request){
      return this.success({
        _embedded: {
          vhosts: [vhostData]
        }
      });
    });

    stubRequest('get', serviceUrl, function(request){
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

test(`visit ${url} shows form, basic info`, function(assert) {
  signInAndVisit(url);
  andThen( () => {
    assert.equal(currentPath(), 'dashboard.app.vhosts.edit');
    expectTitle(`Edit ${virtualDomain} - ${appHandle}`);
    assert.equal(find('.panel-heading h3').text(), `Edit ${virtualDomain}`);

    let serviceInput = findInput('service');
    assert.ok(serviceInput.length, 'has service input');
    assert.ok(serviceInput.is(':disabled'), 'service is disabled');
    assert.equal(serviceInput.find('option:first').val(), serviceHandle);

    expectInput('virtual-domain');
    assert.equal(findInput('virtual-domain').val(), virtualDomain,
          'virtual domain is filled in input');

    expectInput('certificate');
    assert.equal(findInput('certificate').val(), '',
          'certificate is empty');
    expectInput('private-key');
    assert.equal(findInput('private-key').val(), '',
          'private key is empty');

    expectButton('Save VHost');
    expectButton('Cancel');
  });
});

test(`visit ${url} click save`, function(assert) {
  assert.expect(10);

  let newVirtualDomain = 'new-virt.domain.com';
  let newCert = 'abc-new-cert';
  let newPk = 'abc-new-pk';

  stubRequest('put', `/vhosts/${vhostId}`, function(request){
    assert.ok(true, 'posts to create vhost');
    let json = this.json(request);

    assert.equal(json.virtual_domain, newVirtualDomain);
    assert.equal(json.certificate, newCert);
    assert.equal(json.private_key, newPk);

    return this.success(Ember.merge(json, {id:vhostId, status: 'provisioned' }));
  });

  stubRequest('post', `/vhosts/${vhostId}/operations`, function(request){
    assert.ok(true, 'posts to create vhost operation');
    let json = this.json(request);

    assert.equal(json.type, 'reprovision');
    assert.equal(json.certificate, newCert);
    assert.equal(json.private_key, newPk);
    return this.success({
      id: 'new-op-id',
      type: json.type
    });
  });

  signInAndVisit(url);
  andThen( () => {
    fillIn(findInput('virtual-domain'), newVirtualDomain);
    fillIn(findInput('certificate'), newCert);
    fillIn(findInput('private-key'), newPk);

    click(findButton('Save VHost'));
  });

  andThen( () => {
    assert.equal(currentPath(), 'dashboard.app.vhosts.index');

    assert.ok( find(`.vhost .vhost-virtualdomain:contains(${newVirtualDomain})`).length,
        'shows new virtual domain "${newVirtualDomain}"');
  });
});

test(`visit ${url} click save and error`, function(assert) {
  let errorMsg = 'There was an error with this domain';

  stubRequest('put', `/vhosts/${vhostId}`, function(request){
    return this.error({
      message: errorMsg
    });
  });

  signInAndVisit(url);
  andThen( () => {
    click(findButton('Save VHost'));
  });

  andThen( () => {
    assert.equal(currentPath(), 'dashboard.app.vhosts.edit');

    assert.ok(find('.alert').length, 'has error div');
    assert.ok(find('.alert').text().indexOf(errorMsg) > -1,
       `shows error message "${errorMsg}"`);
  });
});

test(`visit ${url} and click cancel`, function(assert) {
  let newVirtualDomain = 'new-virt.domain.com';

  signInAndVisit(url);
  andThen( () => {
    fillInput('virtual-domain', newVirtualDomain);
    clickButton('Cancel');
  });

  andThen( () => {
    assert.equal(currentPath(), 'dashboard.app.vhosts.index');

    assert.ok(!find(`.vhost .vhost-virtualdomain:contains(${newVirtualDomain})`).length,
       `does not show new virtual domain: "${newVirtualDomain}"`);
    assert.ok(find(`.vhost .vhost-virtualdomain:contains(${virtualDomain})`).length,
       `does show old virtual domain "${virtualDomain}"`);
  });
});

test(`visit ${url} and transition away`, function(assert) {
  let newVirtualDomain = 'new-virt.domain.com';

  signInAndVisit(url);
  andThen( () => {
    fillInput('virtual-domain', newVirtualDomain);
    visit(vhostsUrl);
  });

  andThen( () => {
    assert.equal(currentPath(), 'dashboard.app.vhosts.index');

    assert.ok(!find(`.vhost .vhost-virtualdomain:contains(${newVirtualDomain})`).length,
       `does not show new virtual domain: "${newVirtualDomain}"`);
    assert.ok(find(`.vhost .vhost-virtualdomain:contains(${virtualDomain})`).length,
       `does show old virtual domain "${virtualDomain}"`);
  });
});
