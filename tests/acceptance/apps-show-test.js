import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: Apps Show', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('/apps/:id requires authentication', function(){
  expectRequiresAuthentication('/apps/1');
});

test('visiting /apps/my-app-id shows basic app info', function() {
  var appId = 'my-app-id';
  var serviceId = 'service-1';

  stubRequest('get', '/apps/' + appId, function(request){
    return this.success({
      id: appId,
      handle: 'my-app',
      _embedded: { services: [] }
    });
  });

  signInAndVisit('/apps/' + appId);

  andThen(function() {
    equal(currentPath(), 'app.services', 'show page is visited');

    var app = find('.resource-title:contains(my-app)');
    ok(app.length, 'shows app handle');

    var linkToOperations = find('a[href~="/apps/my-app-id/activity"]');
    ok(linkToOperations.length, 'links to activity');

    var linkToVhosts = find('a[href~="/apps/my-app-id/vhosts"]');
    ok(linkToVhosts.length, 'links to vhosts');
  });
});

test('visiting /apps/my-app-id when the app is deprovisioned', function() {
  var appId = 'my-app-id';

  stubRequest('get', '/apps/' + appId, function(request){
    ok(true, 'loads app');
    return this.success({
      id: appId,
      handle: 'my-app',
      status: 'deprovisioned'
    });
  });

  signInAndVisit('/apps/' + appId);
  andThen(function() {
    var deprovisionTitle = find('.resource-metadata-value:contains(Deprovisioned)');
    ok(deprovisionTitle.length, 'show deprovision title');
  });
});

test('visiting /apps/my-app-id/services shows services', function() {
  var appId = 'my-app-id';

  stubRequest('get', '/apps/' + appId, function(request){
    return this.success({
      id: appId,
      handle: 'my-app',
      _links: {
        services: { href: '/apps/my-app-id/services' }
      }
    });
  });

  stubRequest('get', '/apps/my-app-id/services', function(request){
    return this.success({
      _embedded: {
        services: [{
          id: 'service-1',
          handle: 'hubot-service',
          processType: 'web',
          container_count: 1,
          _links: {
            vhosts: { href: '/services/service-1/vhosts' }
          }
        },{
          id: 'service-2',
          handle: 'slack-service',
          processType: 'worker',
          container_count: 2,
          _links: {
            vhosts: { href: '/services/service-2/vhosts' }
          }
        }]
      }
    });
  });

  signInAndVisit('/apps/' + appId);

  andThen(function() {
    var servicesLink = find('a[href~="/apps/my-app-id/services"]');
    ok(servicesLink.length, 'has link to services');

    click(servicesLink);
  });

  andThen(function(){
    var services = find('.service');
    equal(services.length, 2, 'shows 2 services');

    var hubot = findWithAssert('.service:eq(0)');
    ok( find('h3:contains(web)', hubot).length,
        'shows web process type' );
    var handle = find('h3:contains(Web)', hubot);

    var slack = findWithAssert('.service:eq(1)');
    ok( find('h3:contains(worker)', slack).length,
        'shows worker process type' );
  });
});

test('visit /apps/:id/services and change service container count', function(){
  var appId = 'my-app-id';
  var serviceId = 'service-1';

  stubRequest('get', '/apps/' + appId, function(request){
    return this.success({
      id: appId,
      handle: 'my-app',
      _links: { services: { href: '/apps/' + appId + '/services' } }
    });
  });

  stubRequest('get', '/apps/' + appId + '/services', function(request){
    return this.success({
      _embedded: {
        services: [{
          id: serviceId,
          handle: 'hubot-service',
          container_count: 1,
        }]
      }
    });
  });

  stubRequest('put', '/services/' + serviceId, function(request){
    var json = this.json(request);
    equal(json.container_count, 5, 'has correct container count');

    return this.success({
      id: serviceId,
      handle: 'hubot-service',
      container_count: 5
    });
  });

  signInAndVisit('/apps/' + appId + '/services');
  slideNoUISlider('.slider', 5);
  setNoUISlider('.slider', 5);
  click('button:contains(Scale)');
});
