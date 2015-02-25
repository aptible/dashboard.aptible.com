// click button -> save vhost, create reprovision operation

import Ember from 'ember';
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
  setup: function() {
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
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test(`visit ${url} shows form, basic info`, function(){
  signInAndVisit(url);
  andThen( () => {
    equal(currentPath(), 'app.vhosts.edit');
    titleUpdatedTo(`Edit ${virtualDomain} - ${appHandle}`);
    equal(find('.panel-heading h3').text(), `Edit ${virtualDomain}`);

    let serviceInput = findInput('service');
    ok(serviceInput.length, 'has service input');
    ok(serviceInput.is(':disabled'), 'service is disabled');
    equal(serviceInput.find('option:first').val(), serviceHandle);

    expectInput('virtual-domain');
    equal(findInput('virtual-domain').val(), virtualDomain,
          'virtual domain is filled in input');

    expectInput('certificate');
    equal(findInput('certificate').val(), '',
          'certificate is empty');
    expectInput('private-key');
    equal(findInput('private-key').val(), '',
          'private key is empty');

    expectButton('Save VHost');
    expectButton('Cancel');
  });
});

test(`visit ${url} click save`, function(){
  expect(8);

  let newVirtualDomain = 'new-virt.domain.com';
  let newCert = 'abc-new-cert';
  let newPk = 'abc-new-pk';

  stubRequest('put', `/vhosts/${vhostId}`, function(request){
    ok(true, 'posts to create vhost');
    let json = this.json(request);

    equal(json.virtual_domain, newVirtualDomain);
    equal(json.certificate, newCert);
    equal(json.private_key, newPk);

    return this.success(Ember.merge(json, {id:vhostId}));
  });

  stubRequest('post', `/vhosts/${vhostId}/operations`, function(request){
    ok(true, 'posts to create vhost operation');
    let json = this.json(request);

    equal(json.type, 'reprovision');
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
    equal(currentPath(), 'app.vhosts.index');

    ok( find(`.vhost .vhost-virtualdomain:contains(${newVirtualDomain})`).length,
        'shows new virtual domain "${newVirtualDomain}"');
  });
});

test(`visit ${url} click save and error`, function(){
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
    equal(currentPath(), 'app.vhosts.edit');

    ok(find('.alert').length, 'has error div');
    ok(find('.alert').text().indexOf(errorMsg) > -1,
       `shows error message "${errorMsg}"`);
  });
});

test(`visit ${url} and click cancel`, function(){
  let newVirtualDomain = 'new-virt.domain.com';

  signInAndVisit(url);
  andThen( () => {
    fillInput('virtual-domain', newVirtualDomain);
    clickButton('Cancel');
  });

  andThen( () => {
    equal(currentPath(), 'app.vhosts.index');

    ok(!find(`.vhost .vhost-virtualdomain:contains(${newVirtualDomain})`).length,
       `does not show new virtual domain: "${newVirtualDomain}"`);
    ok(find(`.vhost .vhost-virtualdomain:contains(${virtualDomain})`).length,
       `does show old virtual domain "${virtualDomain}"`);
  });
});

test(`visit ${url} and transition away`, function(){
  let newVirtualDomain = 'new-virt.domain.com';

  signInAndVisit(url);
  andThen( () => {
    fillInput('virtual-domain', newVirtualDomain);
    visit(vhostsUrl);
  });

  andThen( () => {
    equal(currentPath(), 'app.vhosts.index');

    ok(!find(`.vhost .vhost-virtualdomain:contains(${newVirtualDomain})`).length,
       `does not show new virtual domain: "${newVirtualDomain}"`);
    ok(find(`.vhost .vhost-virtualdomain:contains(${virtualDomain})`).length,
       `does show old virtual domain "${virtualDomain}"`);
  });
});
