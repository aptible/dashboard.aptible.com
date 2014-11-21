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

test('visiting /apps/my-app-id shows the app handle', function() {
  stubRequest('get', '/apps/my-app-id', function(request){
    return this.success({
      id: 'my-app-id',
      handle: 'my-app'
    });
  });

  signInAndVisit('/apps/my-app-id');

  andThen(function() {
    equal(currentPath(), 'apps.show', 'show page is visited');

    var app = find('.app-handle:contains(my-app)');
    ok(app.length, 'shows app handle');
  });
});

test('visiting /apps/my-app-id when the app is deprovisioned', function() {
  stubRequest('get', '/apps/my-app-id', function(request){
    ok(true, 'loads app');
    return this.success({
      id: 'my-app',
      handle: 'my-app',
      status: 'deprovisioned'
    });
  });

  signInAndVisit('/apps/my-app-id');
  andThen(function() {
    var deprovisionTitle = find('h1.empty-resource-title');
    ok(deprovisionTitle.length, 'show deprovision title');

    var deprovisionMessage = find(':contains(This app has been deprovisioned.)');
    ok(deprovisionMessage.length, 'shows deprovision message');
  });
});

test('visiting /apps/my-app-id shows services', function() {
  stubRequest('get', '/apps/my-app-id', function(request){
    return this.success({
      id: 'my-app-id',
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
          container_count: 1,
          _links: {
            vhosts: { href: '/services/service-1/vhosts' }
          }
        },{
          id: 'service-2',
          handle: 'slack-service',
          container_count: 2,
          _links: {
            vhosts: { href: '/services/service-2/vhosts' }
          }
        }]
      }
    });
  });

  stubRequest('get', '/services/service-1/vhosts', function(request){
    return this.success({
      _embedded: {
        vhosts: [{
          id: 'vhost-1',
          virtual_domain: 'vhost.vdomain.com',
          external_host: 'vhost.ext-host.amazonaws.com'
        }]
      }
    });
  });

  stubRequest('get', '/services/service-2/vhosts', function(request){
    return this.success({
      _embedded: { vhosts: [] }
    });
  });

  signInAndVisit('/apps/my-app-id');

  andThen(function() {
    var services = find('.service');
    equal(services.length, 2, 'shows 2 services');

    var hubot = findWithAssert('.service:eq(0)');
    var handle = find('.service-handle', hubot);
    var containers = find('.service-containers', hubot);
    var vhostsContainer     = find('.service-vhosts', hubot);
    var vhosts = find('.vhost', vhostsContainer);
    var vhostCount = find('.vhost-count', vhostsContainer);
    var vhostVirtualDomain = find('.vhost-virtual-domain', vhostsContainer);
    var vhostExternalHost  = find('.vhost-external-host', vhostsContainer);

    equal(handle.text(), 'hubot-service');
    equal(containers.text(), '1 Container');
    equal(vhosts.length, 1, 'shows 1 vhost for hubot service');
    equalElementText(vhostCount, '1 Vhost');
    equalElementText(vhostVirtualDomain, 'vhost.vdomain.com');
    equalElementText(vhostExternalHost, 'vhost.ext-host.amazonaws.com');

    var slack = findWithAssert('.service:eq(1)');
    handle = find('.service-handle', slack);
    containers = find('.service-containers', slack);
    vhostsContainer     = find('.service-vhosts', slack);
    vhosts = find('.vhost', vhostsContainer);
    vhostCount = find('.vhost-count', vhostsContainer);

    equal(handle.text(), 'slack-service');
    equal(containers.text(), '2 Containers');
    equal(vhosts.length, 0, 'shows 0 vhost for slack service');
    equalElementText(vhostCount, '0 Vhosts');
  });
});
