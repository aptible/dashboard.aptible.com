import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;

let appId = '1';
let appUrl = '/apps/' + appId;
let appVhostsUrl = '/apps/' + appId + '/vhosts';
let appVhostsApiUrl = '/apps/' + appId + '/vhosts';
let appVhostsNewUrl = '/apps/' + appId + '/vhosts/new';

var formInputNames = ['service', 'virtual-domain', 'certificate', 'private-key'];

module('Acceptance: App Vhost New', {
  setup: function() {
    App = startApp();
    stubStacks();
    stubOrganization();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit ' + appVhostsNewUrl + ' requires authentication', function(){
  expectRequiresAuthentication(appVhostsNewUrl);
});

test(`visiting ${appVhostsUrl} without any Vhosts redirects to ${appVhostsNewUrl}`, function() {
  stubStacks();
  stubApp({ id: appId });
  signInAndVisit(appVhostsUrl);

  andThen(function() {
    equal(currentPath(), 'dashboard.app.vhosts.new');
  });
});

test(`visit ${appVhostsNewUrl} shows creation form`, function(){
  var appId = 1;
  var appHandle = 'whammo-com';
  var stackHandle = 'moop-com';

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
    ok(find('.panel-heading:contains(Create a new VHost)').length,
       'has header');
    expectInput('service', {input:'select'});
    expectFocusedInput('service', {input:'select'});
    expectInput('virtual-domain');
    expectInput('certificate', {input:'textarea'});
    expectInput('private-key', {input:'textarea'});
    expectButton('Save VHost');
    expectButton('Cancel');
    expectTitle(`Add a domain - ${appHandle} - ${stackHandle}`);
  });
});

test(`visit ${appVhostsNewUrl} and create vhost`, function(){
  expect(5);

  let appId = 1;
  let serviceId = 'the-service-id';
  let vhostId = 'new-vhost-id';

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

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({
      _embedded: { vhosts: [] }
    });
  });

  signInAndVisit(appVhostsNewUrl);

  stubRequest('post', `/services/${serviceId}/vhosts`, function(request){
    let json = this.json(request);
    equal(json.virtual_domain, 'my.domain.com');
    equal(json.certificate, 'my long cert');
    equal(json.private_key, 'my long pk');
    equal(json.type, 'http');

    return this.success({id:vhostId});
  });

  stubRequest('post', `/vhosts/${vhostId}/operations`, function(request){
    let json = this.json(request);
    equal(json.type, 'provision', 'posts provision operation');
    return this.success({id: 'new-op-id'});
  });

  signInAndVisit(appVhostsNewUrl);
  andThen(function(){
    fillInput('virtual-domain', 'my.domain.com');
    fillInput('certificate', 'my long cert');
    fillInput('private-key', 'my long pk');
    clickButton('Save VHost');
  });
});
