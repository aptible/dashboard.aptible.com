import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

var appId = '1';
var appUrl = '/apps/' + appId;
var appVhostsUrl = '/apps/' + appId + '/vhosts';
var appVhostsApiUrl = '/apps/' + appId + '/vhosts';
var appVhostsNewUrl = '/apps/' + appId + '/vhosts/new';

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
    equal(currentPath(), 'app.vhosts.new');
  });
});

test('visit ' + appVhostsNewUrl + ' shows creation form', function(){
  var appId = 1;
  var appHandle = 'whammo-com';
  var stackHandle = 'moop-com';

  stubApp({
    id: appId,
    handle: appHandle,
    _embedded: { services: [] },
    _links: {
      vhosts: { href: appVhostsApiUrl },
      stack: { href: `/accounts/${stackHandle}` }
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
    var header = find('.panel-heading:contains(Create a new VHost)');
    ok(header.length, 'has header');

    formInputNames.forEach(function(name){
      ok( find('.form-group *[name~="' + name + '"]').length,
          'has input with name ' + name);
    });

    ok( find('button:contains(Save VHost)').length,
        'has save button');

    ok( find('button:contains(Cancel)').length,
        'has Cancel button');
  });
  titleUpdatedTo(`Add a domain - ${appHandle} - ${stackHandle}`);
});

test('visit /services/:id/vhosts/new and create vhost', function(){
  var appId = 1;
  var serviceId = 'the-service-id';

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

  signInAndVisit('/apps/' + appId + '/vhosts/new');

  stubRequest('post', '/services/' + serviceId + '/vhosts', function(request){
    var json = this.json(request);
    equal(json.virtual_domain, 'my.domain.com');
    equal(json.certificate, 'my long cert');
    equal(json.private_key, 'my long pk');
    equal(json.type, 'http');

    return this.success({
      id: 'new-vhost-id',
    });
  });

  signInAndVisit('/apps/' + appId + '/vhosts/new');
  fillIn('input[name="virtual-domain"]', 'my.domain.com');
  fillIn('textarea[name="certificate"]', 'my long cert');
  fillIn('textarea[name="private-key"]', 'my long pk');

  click('button:contains(Save VHost)');
});
