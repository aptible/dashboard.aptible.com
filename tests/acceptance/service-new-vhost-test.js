import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: App New Vhost', {
  setup: function() {
    App = startApp();
    stubStacks();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /apps/:id/vhosts/new requires authentication', function(){
  expectRequiresAuthentication('/apps/1/vhosts/new');
});

test('visit /apps/:id/vhosts/new', function(){
  var appId = 1;

  stubApp({
    id: appId,
    _links: {
      services: { href: '/apps/' + appId + '/services' }
    }
  });

  stubRequest('get', '/apps/' + appId + '/services', function(){
    return this.success({
      _embedded: {
        services: [{
          id: 1,
          _links: {
            vhosts: { href: '/services/1/vhosts' }
          }
        }]
      }
    });
  });

  stubRequest('get', '/services/1/vhosts', function(){
    return this.success({
      _embedded: {
        vhosts: [{
          id: 1
        }]
      }
    });
  });

  signInAndVisit('/apps/' + appId + '/vhosts/new');

  andThen(function(){
    var header = find('.panel-heading:contains(Create a new VHost)');
    ok(header.length, 'has header');

    ['Service', 'Virtual Domain', 'Certificate', 'Private Key'].forEach(function(name){
      ok( find('.form-group:contains(' + name + ')').length,
          'has input for ' + name);
    });

    ok( find('button:contains(Save VHost)').length,
        'has save button');

    ok( find('button:contains(Cancel)').length,
        'has Cancel button');
  });
});

test('visit /services/:id/vhosts/new and create vhost', function(){
  var appId = 1;

  stubApp({
    id: appId,
    _links: {
      services: { href: '/apps/' + appId + '/services' }
    }
  });

  stubRequest('get', '/apps/' + appId + '/services', function(){
    return this.success({
      _embedded: {
        services: [{
          id: 1,
          _links: {
            vhosts: { href: '/services/1/vhosts' }
          }
        }]
      }
    });
  });

  stubRequest('get', '/services/1/vhosts', function(){
    return this.success({
      _embedded: {
        vhosts: [{
          id: 1
        }]
      }
    });
  });

  signInAndVisit('/apps/' + appId + '/vhosts/new');

  stubRequest('post', '/services/1/vhosts', function(request){
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
