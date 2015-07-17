import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

var appId = '1';
var appUrl = '/apps/' + appId;
var appVhostsUrl = '/apps/' + appId + '/vhosts';
var appVhostsApiUrl = '/apps/' + appId + '/vhosts';
var appVhostsNewUrl = '/apps/' + appId + '/vhosts/new';

module('Acceptance: App Vhosts', {
  beforeEach: function() {
    App = startApp();
    stubRequest('get', '/users/user1/ssh_keys', function(){
      return this.success({
        _embedded: {
          ssh_keys: []
        }
      });
    });
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test(`${appVhostsUrl} requires authentication`, function(assert) {
  expectRequiresAuthentication(appVhostsUrl);
});

test(`app show page includes link to ${appVhostsUrl}`, function(assert) {
  stubApp({
    id: appId,
    status: 'provisioned'
  });

  signInAndVisit(appUrl);

  andThen(function(){
    expectLink(appVhostsUrl);
  });
});

test(`visit ${appVhostsUrl} has link to ${appVhostsNewUrl}`, function(assert) {
  let appHandle = 'handle-app';
  let stackHandle = 'handle-stack';

  var vhosts = [{
    id: 1,
    virtual_domain: 'www.health1.io',
    external_host: 'www.host1.com'
  },{
    id: 2,
    virtual_domain: 'www.health2.io',
    external_host: 'www.host2.com'
  }];

  stubApp({
    id: appId,
    handle: appHandle,
    _embedded: {
      services: []
    },
    _links: {
      vhosts: { href: appVhostsApiUrl },
      account: {href: '/accounts/'+stackHandle}
    }
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({
      _embedded: {
        vhosts: vhosts
      }
    });
  });

  stubStack({
    id: stackHandle,
    handle: stackHandle
  });

  signInAndVisit(appVhostsUrl);

  andThen(function(){
    expectLink(appVhostsNewUrl);
    expectTitle(`${appHandle} Domains - ${stackHandle}`);
  });
});

test(`visit ${appVhostsUrl} lists active vhosts`, function(assert) {
  var vhosts = [{
    id: 1,
    virtual_domain: 'www.health1.io',
    external_host: 'www.host1.com',
    status: 'provisioned'
  },{
    id: 2,
    virtual_domain: 'www.health2.io',
    external_host: 'www.host2.com',
    status: 'provisioned'
  }];

  stubApp({
    id: appId,
    _embedded: { services: [] },
    _links: { vhosts: { href: appVhostsApiUrl } }
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({ _embedded: { vhosts: vhosts } });
  });

  signInAndVisit(appVhostsUrl);

  andThen(function(){
    assert.equal( find('.vhost').length, vhosts.length);

    vhosts.forEach(function(vhost, index){
      let vhostEl = find(`.vhost:eq(${index})`);
      assert.ok(vhostEl.find(`:contains(${vhost.virtual_domain})`).length,
         `has virtual domain "${vhost.virtual_domain}"`);

      assert.ok(vhostEl.find(`:contains(${vhost.external_host})`).length,
         `has external host "${vhost.external_host}"`);

      expectButton('Edit', {context:vhostEl});
      expectButton('Delete', {context:vhostEl});
    });
  });
});

test(`visit ${appVhostsUrl} lists pending vhosts`, function(assert) {
  var vhosts = [{
    id: 1,
    virtual_domain: 'www.health1.io',
    external_host: 'www.host1.com',
    status: 'provisioning'
  },{
    id: 2,
    virtual_domain: 'www.health2.io',
    external_host: 'www.host2.com',
    status: 'provisioning'
  }];

  stubApp({
    id: appId,
    _embedded: { services: [] },
    _links: { vhosts: { href: appVhostsApiUrl } }
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({ _embedded: { vhosts: vhosts } });
  });

  signInAndVisit(appVhostsUrl);

  andThen(function(){
    let el = find('.pending-domains');
    assert.equal( el.find('.vhost').length, vhosts.length);

    vhosts.forEach(function(vhost, index){
      let vhostEl = find(`.vhost:eq(${index})`);
      assert.ok(vhostEl.find(`:contains(${vhost.virtual_domain})`).length,
         `has virtual domain "${vhost.virtual_domain}"`);

      assert.ok(vhostEl.find(`:contains(${vhost.external_host})`).length,
         `has external host "${vhost.external_host}"`);

      expectButton('Edit', {context:vhostEl});
      expectButton('Delete', {context:vhostEl});
    });
  });
});

test(`visit ${appVhostsUrl} lists deprovisioning`, function(assert) {
    var vhosts = [{
    id: 1,
    virtual_domain: 'www.health1.io',
    external_host: 'www.host1.com',
    status: 'deprovisioned'
  },{
    id: 2,
    virtual_domain: 'www.health2.io',
    external_host: 'www.host2.com',
    status: 'deprovisioning'
  }];

  stubApp({
    id: appId,
    _embedded: { services: [] },
    _links: { vhosts: { href: appVhostsApiUrl } }
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({ _embedded: { vhosts: vhosts } });
  });

  signInAndVisit(appVhostsUrl);

  andThen(function(){
    let el = find('.deprovisioned-domains');
    assert.equal( el.find('.vhost').length, vhosts.length);

    vhosts.forEach(function(vhost, index){
      let vhostEl = find(`.vhost:eq(${index})`);
      assert.ok(vhostEl.find(`:contains(${vhost.virtual_domain})`).length,
         `has virtual domain "${vhost.virtual_domain}"`);

      assert.ok(vhostEl.find(`:contains(${vhost.external_host})`).length,
         `has external host "${vhost.external_host}"`);

      expectNoButton('Edit', {context:vhostEl});
      expectNoButton('Delete', {context:vhostEl});
    });
  });
});

test(`visit ${appVhostsUrl} allows deleting vhost`, function(assert) {
  assert.expect(2);

  let vhostId = 'vhost-1';
  var vhosts = [{id: vhostId, status: 'provisioned'}];

  stubApp({
    id: appId,
    _embedded: { services: [] },
    _links: { vhosts: { href: appVhostsApiUrl } }
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({ _embedded: { vhosts: vhosts } });
  });

  stubRequest('post', `/vhosts/${vhostId}/operations`, function(request){
    let json = this.json(request);
    assert.equal(json.type, 'deprovision', 'creates deprovision operation');
    return this.success();
  });

  signInAndVisit(appVhostsUrl);
  andThen(function(){
    click(findButton('Delete'));
  });
  andThen(function(){
    assert.equal(find('.vhost').length, 0,
          'the vhost is no longer shown in the UI');
  });
});

test(`visit ${appVhostsUrl} and delete vhost has error`, function(assert) {
  assert.expect(2);

  let vhostId = 'vhost-1';
  var vhosts = [{id: vhostId, status: 'provisioned'}];

  stubApp({
    id: appId,
    _embedded: { services: [] },
    _links: { vhosts: { href: appVhostsApiUrl } }
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({ _embedded: { vhosts: vhosts } });
  });

  stubRequest('post', `/vhosts/${vhostId}/operations`, function(request){
    let json = this.json(request);
    return this.error(401, {});
  });

  signInAndVisit(appVhostsUrl);
  andThen(function(){
    click(findButton('Delete'));
  });
  andThen(function(){
    let errorMessage = 'error deleting the VHost';
    let alert = find(`.alert`);
    assert.ok(alert.length, 'displays error div');
    assert.ok(alert.text().indexOf(errorMessage) > -1,
       `Displays error message "${errorMessage}"`);
  });
});
