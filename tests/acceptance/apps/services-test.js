import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;

let appId = '1';
let appUrl = `/apps/${appId}`;
let appHandle = 'my-app-handle',
    stackHandle = 'my-stack-handle',
    stackId = 'my-stack-id';
let appServicesUrl = `/apps/${appId}/services`;
let url = appServicesUrl;

module('Acceptance: App Services', {
  beforeEach: function() {
    App = startApp();
    stubStacks();
    stubOrganizations();
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

test(`${url} requires authentication`, function() {
  expectRequiresAuthentication(url);
});

test('app show page includes link to services url', function() {
  stubApp({
    id: appId,
    status: 'provisioned'
  });
  stubStack({ id: 'stubbed-stack' });

  signInAndVisit(appUrl);

  andThen(function(){
    expectLink(appServicesUrl);
  });
});

test(`visit ${url} lists services`, function(assert) {
  let services = [{
    id: 1,
    handle: 'hubot',
    command: 'bin/exec hubot',
    processType: 'web',
    container_count: 1
  },{
    id: 2,
    handle: 'web',
    command: 'bundle exec rails s -e $PORT',
    processType: 'worker',
    container_count: 2
  }];

  stubApp({
    id: appId,
    handle: appHandle,
    _embedded: { services: services },
    _links: { account: { href: `/accounts/${stackId}` } }
  });

  stubStack({
    id: stackId,
    handle: stackHandle
  });

  signInAndVisit(url);
  andThen(function(){
    assert.equal(find('.service').length, services.length,
          `has ${services.length} services`);

    services.forEach(function(service, index){
      let el = find(`.service:eq(${index})`);

      assert.ok( el.find(`.process-type:contains(${service.processType})`).length,
          `has process type ${service.processType}`);

      assert.ok( el.find(`.service-command:contains(${service.command})`).length,
          `has command ${service.command}`);

      assert.ok( el.find(`.container-count:contains(${service.container_count})`).length,
          `has container count ${service.container_count}`);
    });

    expectTitle(`${appHandle} Services - ${stackHandle}`);
  });
});

test(`visit ${url} allows scaling of services`, function(assert) {
  assert.expect(6);

  let serviceId = 1;
  let operationId = 1;
  let services = [{id: serviceId, container_count: 2}];
  let newContainerCount = 3;

  stubApp({
    id: appId,
    _embedded: { services: services },
    _links: { account: { href: `/accounts/${stackId}` } }
  });

  stubStack({id: stackId});

  stubRequest('get', `/services/${serviceId}`, function(request){
    assert.ok(true, 'GETs service');
    let json = this.json(request);
    json.id = serviceId;
    return this.success(json);
  });

  stubRequest('post', `/services/${serviceId}/operations`, function(request){
    let json = this.json(request);
    assert.equal(json.type, 'scale');
    assert.equal(json.container_count, newContainerCount);
    json.id = serviceId;
    return this.success(json);
  });

  stubRequest('get', `/operations/${operationId}`, function(request){
    assert.ok(true, 'GETs operation');
    let json = this.json(request);
    json.id = operationId;
    json.status = 'succeeded';
    return this.success(json);
  });

  signInAndVisit(url);
  andThen(() => {
    assert.equal($('.btn:contains("Scale")').css('visibility'), 'hidden');
    triggerSlider('.slider', newContainerCount);
  });
  andThen(() => {
    assert.equal($('.btn:contains("Scale")').css('visibility'), 'visible');
    clickButton('Scale');
  });
});
