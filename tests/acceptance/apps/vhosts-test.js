import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

var appId = '1';
var appUrl = '/apps/' + appId;
var vhostsApiUrl = '/vhosts/';
var appVhostsUrl = '/apps/' + appId + '/vhosts';
var appVhostsApiUrl = '/apps/' + appId + '/vhosts';
var appVhostsNewUrl = '/apps/' + appId + '/vhosts/new';

module('Acceptance: App Endpoints', {
  beforeEach: function() {
    App = startApp();
    stubStacks();
    stubOrganizations();
    stubStack({ id: 'stubbed-stack' });
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

test(`${appVhostsUrl} requires authentication`, function() {
  expectRequiresAuthentication(appVhostsUrl);
});

test(`app show page includes link to ${appVhostsUrl}`, function() {
  stubApp({
    id: appId,
    status: 'provisioned'
  });

  signInAndVisit(appUrl);

  andThen(function(){
    expectLink(appVhostsUrl);
  });
});

test(`visit ${appVhostsUrl} has link to ${appVhostsNewUrl}`, function() {
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
    expectTitle(`${appHandle} Endpoints - ${stackHandle}`);
  });
});

test(`visit ${appVhostsUrl} lists active endpoints`, function(assert) {
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
         `has endpoint "${vhost.virtual_domain}"`);

      assert.ok(vhostEl.find(`:contains(${vhost.external_host})`).length,
         `has external host "${vhost.external_host}"`);

      expectButton('Edit', {context:vhostEl});
      expectButton('Delete', {context:vhostEl});
    });
  });
});

test(`visit ${appVhostsUrl} lists endpoints with action required with tips`, function(assert) {
  assert.expect(15);

  var vhosts = [{
    id: 1,
    virtual_domain: 'www.health1.io',
    user_domain: 'www.health1.io',
    acme: true,
    acme_status: 'transitioning',
    external_host: 'www.host1.com',
    status: 'provisioned',
  },{
    id: 2,
    virtual_domain: 'www.health2.io',
    user_domain: 'www.health2.io',
    acme: true,
    acme_status: 'pending',
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

  andThen(() => {
    assert.equal(find('.vhost').length, vhosts.length);

    vhosts.forEach(function(vhost, index){
      let vhostEl = find(`.vhost:eq(${index})`);
      assert.ok(vhostEl.find(`:contains(${vhost.virtual_domain})`).length,
         `has endpoint "${vhost.virtual_domain}"`);

      assert.ok(vhostEl.find(`:contains(${vhost.external_host})`).length,
         `has external host "${vhost.external_host}"`);

      assert.ok(vhostEl.find("button:contains(I Created The CNAME)").length,
         "has I Created The CNAME button");

      assert.ok(vhostEl.find(":contains(Action Required)").length,
         "has Action Required label");

      if (vhost.acme_status === 'pending') {
        assert.ok(vhostEl.find(":contains(temporarily unavailable)").length,
                  "has temporarily unavailable tip");
      } else {
        assert.ok(vhostEl.find(":contains(in the background)").length,
                  "has background tip");
      }

      // Note: those count in assert.expect
      expectNoButton('Edit', {context:vhostEl});
      expectButton('Delete', {context:vhostEl});
    });
  });
});

test(`visit ${appVhostsUrl} lists pending vhosts`, function(assert) {
  var vhosts = [{
    id: 0,
    virtual_domain: 'www.health1.io',
    external_host: 'www.host1.com',
    status: 'provisioning'
  },{
    id: 1,
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

  stubRequest('get', vhostsApiUrl + ':id', function(request) {
    return this.success(vhosts[request.params.id]);
  });

  signInAndVisit(appVhostsUrl);

  andThen(function(){
    let el = find('.pending-domains');
    assert.equal( el.find('.vhost').length, vhosts.length);

    vhosts.forEach(function(vhost, index){
      let vhostEl = find(`.vhost:eq(${index})`);
      assert.ok(vhostEl.find(`:contains(${vhost.virtual_domain})`).length,
         `has endpoint "${vhost.virtual_domain}"`);

      assert.ok(vhostEl.find(`:contains(${vhost.external_host})`).length,
         `has external host "${vhost.external_host}"`);

      expectNoButton('Edit', {context:vhostEl});
      expectNoButton('Delete', {context:vhostEl});
    });

    vhosts.forEach(function(vhost) {
      vhost.status = 'provisioned';
    });
  });
});

test(`visit ${appVhostsUrl} lists deprovisioned`, function(assert) {
  var vhosts = [{
    id: 0,
    virtual_domain: 'www.health1.io',
    external_host: 'www.host1.com',
    status: 'deprovisioned'
  }];

  stubApp({
    id: appId,
    _embedded: { services: [] },
    _links: { vhosts: { href: appVhostsApiUrl } }
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({ _embedded: { vhosts: vhosts } });
  });

  stubRequest('get', vhostsApiUrl + ':id', function(request) {
    return this.success(vhosts[request.params.id]);
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

test(`visit ${appVhostsUrl} lists deprovisioning`, function(assert) {
  var vhosts = [{
    id: 1,
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

  stubRequest('get', vhostsApiUrl + ':id', function() {
    return this.success(vhosts[0]);
  });

  signInAndVisit(appVhostsUrl);

  andThen(function(){
    let el = find('.deprovisioning-domains');
    assert.equal( el.find('.vhost').length, vhosts.length);

    vhosts.forEach(function(vhost, index){
      let vhostEl = find(`.vhost:eq(${index})`);

      assert.ok(vhostEl.find(`:contains(${vhost.virtual_domain})`).length,
         `has endpoint "${vhost.virtual_domain}"`);

      assert.ok(vhostEl.find(`:contains(${vhost.external_host})`).length,
        `has external host "${vhost.external_host}"`);

      expectNoButton('Edit', {context:vhostEl});
      expectNoButton('Delete', {context:vhostEl});
    });
  });
});

test(`attempting to delete an endpoint should confirm`, function(assert) {
  assert.expect(1);

  window.confirm = function() {
    assert.ok(true, '`window.confirm` called before deleting');
    return false;
  };

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

  stubRequest('post', `/vhosts/${vhostId}/operations`, function(){
    assert.ok(false, 'does not deprovision');
  });

  signInAndVisit(appVhostsUrl);

  andThen(function(){
    click(findButton('Delete'));
  });
});

test(`visit ${appVhostsUrl} allows deleting endpoint`, function(assert) {
  assert.expect(2);

  window.confirm = function() {
    return true;
  };

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

  stubRequest('get', '/vhosts/vhost-1', function(){
    return this.notFound(404);
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
          'the endpoint is no longer shown in the UI');
  });
});

/*
test(`visit ${appVhostsUrl} and delete endpoint has error`, function(assert) {
  assert.expect(2);

  window.confirm = function() {
    return true;
  };

  let vhostId = 'vhost-1';
  var vhosts = [{id: vhostId, status: 'provisioned'}];

  stubApp({
    id: appId,
    _embedded: { services: [] },
    _links: { vhosts: { href: appVhostsApiUrl } }
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({ _embedded: { vhosts: vhosts } });
  }); stubRequest('post', `/vhosts/${vhostId}/operations`, function(request){
    this.json(request);
    return this.error(401, {});
  });

  signInAndVisit(appVhostsUrl);
  andThen(function(){
    click(findButton('Delete'));
  });
  andThen(function(){
    let errorMessage = 'error deleting the endpoint';
    let alert = find(`.alert`);
    assert.ok(alert.length, 'displays error div');
    assert.ok(alert.text().indexOf(errorMessage) > -1,
       `Displays error message "${errorMessage}"`);
  });
});*/

function setupAcmeStubs(assert, options) {
  options = options || {};
  const renewFinalStatus = options.renewSucceeds ? 'succeeded' : 'failed';
  const provisionFinalStatus = options.provisionSucceeds ? 'succeeded' : 'failed';

  const vhostId = "vhost-1";

  const vhost = {
    id: vhostId,
    user_domain: "www.health.io",
    acme: true,
    acme_status: 'pending',
    status: 'provisioned',
    _links: {
      self: { href: `/vhosts/${vhostId}` },
      operations: { href: `/vhosts/${vhostId}/operations` }
    }
  };

  const certificate = { id: 'cert-1', _links: { self: { href: "/certificates/cert-1" } } };

  const operations = [];
  const renewOperation = { id: "operation-123", type: "renew" };
  const provisionOperation = { id: "operation-456", type: "provision" };

  const createRenew = () => {
    if (options.renewStartsQueued) {
      renewOperation.status = "queued";
    } else {
      completeRenew();
    }
    operations.unshift(renewOperation);
  };

  const completeRenew = () => {
    vhost.acme_status = 'ready';
    vhost._links.certificate = certificate._links.self;
    renewOperation.status = renewFinalStatus;
    if (options.renewTriggersProvision) {
      createProvision();
    }
  };

  const createProvision = () => {
    if (options.provisionStartsQueued) {
      provisionOperation.status = "queued";
    } else {
      completeProvision();
    }
    operations.unshift(provisionOperation);
  };

  const completeProvision = () => {
    provisionOperation.status = provisionFinalStatus;
  };

  stubApp({
    id: appId,
    _embedded: { services: [] },
    _links: { vhosts: { href: appVhostsApiUrl } }
  });

  stubRequest("get", appVhostsApiUrl, function(){
    return this.success({ _embedded: { vhosts: [vhost] } });
  });

  stubRequest("post", `/vhosts/${vhostId}/operations`, function(request){
    const json = this.json(request);
    assert.equal(json.type, "renew", "creates renew operation");
    createRenew();
    return this.success(renewOperation);
  });

  stubRequest("get", `/vhosts/${vhostId}/operations`, function() {
    return this.success({ _embedded: { operations: operations }});
  });

  stubRequest("get", `/vhosts/${vhostId}`, function() {
    return this.success(vhost);
  });

  stubRequest("get", `/operations/${renewOperation.id}`, function() {
    completeRenew();
    return this.success(renewOperation);
  });

  stubRequest("get", `/operations/${provisionOperation.id}`, function() {
    completeProvision();
    return this.success(provisionOperation);
  });

  stubRequest("get", certificate._links.self.href, function() {
    return this.success(certificate);
  });
}

test(`visit ${appVhostsUrl} allows renewing an unitialized ACME cert (delayed success)`, function(assert) {
  assert.expect(3);

  setupAcmeStubs(assert, {
    renewStartsQueued: true,
    renewSucceeds: true,

    provisionStartsQueued: true,
    provisionSucceeds: true,

    renewTriggersProvision: true
  });

  const buttonLabel = "I Created The CNAME";

  signInAndVisit(appVhostsUrl);

  andThen(() => {
    click(findButton(buttonLabel));
  });

  andThen(() => {
    assert.ok(!findButton(buttonLabel).length, "CNAME button is no longer shown");
    assert.ok(find("div:contains(endpoint is ready)").length, "Success notification is shown");
  });
});

test(`visit ${appVhostsUrl} allows renewing an unitialized ACME cert (instant success)`, function(assert) {
  assert.expect(3);

  setupAcmeStubs(assert, {
    renewStartsQueued: true,
    renewSucceeds: true,

    provisionStartsQueued: false,
    provisionSucceeds: true,

    renewTriggersProvision: true
  });

  const buttonLabel = "I Created The CNAME";

  signInAndVisit(appVhostsUrl);

  andThen(() => {
    click(findButton(buttonLabel));
  });

  andThen(() => {
    assert.ok(find("div:contains(endpoint is ready)").length, "Success notification is shown");
    assert.ok(!findButton(buttonLabel).length, "CNAME button is no longer shown");
  });
});

test(`visit ${appVhostsUrl} allows renewing an unitialized ACME cert (renewal fails)`, function(assert) {
  assert.expect(2);

  setupAcmeStubs(assert, {
    renewStartsQueued: true,
    renewSucceeds: false,
    renewTriggersProvision: false
  });

  signInAndVisit(appVhostsUrl);

  andThen(function(){
    click(findButton("I Created The CNAME"));
  });

  andThen(function(){
    assert.ok(find("div:contains(Failed to generate certificate)").length,
              "Failure notification is shown");
  });
});

test(`visit ${appVhostsUrl} allows renewing an unitialized ACME cert (provision fails)`, function(assert) {
  assert.expect(2);

  setupAcmeStubs(assert, {
    renewStartsQueued: true,
    renewSucceeds: true,

    provisionStartsQueued: true,
    provisionSucceeds: false,

    renewTriggersProvision: true
  });

  signInAndVisit(appVhostsUrl);

  andThen(function(){
    click(findButton("I Created The CNAME"));
  });

  andThen(function(){
    assert.ok(find("div:contains(Failed to install certificate)").length,
              "Failure notification is shown");
  });
});

test(`visit ${appVhostsUrl} allows renewing an unitialized ACME cert (renewal does not trigger provision)`, function(assert) {
  assert.expect(2);

  setupAcmeStubs(assert, {
    renewStartsQueued: true,
    renewSucceeds: true,
    renewTriggersProvision: false
  });

  signInAndVisit(appVhostsUrl);

  andThen(function(){
    click(findButton("I Created The CNAME"));
  });

  andThen(function(){
    assert.ok(find("div:contains(unexpected error)").length,
              "Failure notification is shown");
  });
});
