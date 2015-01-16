import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

var appId = '1';
var appUrl = '/apps/' + appId;
var appVhostsUrl = '/apps/' + appId + '/vhosts';
var appVhostsApiUrl = '/apps/' + appId + '/vhosts';
var appVhostsNewUrl = '/apps/' + appId + '/vhosts/new';

module('Acceptance: App Vhosts', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test(appVhostsUrl + ' requires authentication', function(){
  expectRequiresAuthentication(appVhostsUrl);
});

test('app show page includes link to vhosts url', function(){
  stubApp({
    id: appId
  });

  signInAndVisit(appUrl);

  andThen(function(){
    ok(find('a[href~="' + appVhostsUrl + '"]').length,
       'has link to ' + appVhostsUrl);
  });
});

test('visit ' + appVhostsUrl + ' has link to ' + appVhostsNewUrl, function(){
  stubApp({
    id: appId
  });

  signInAndVisit(appVhostsUrl);

  andThen(function(){
    ok(find('a[href~="' + appVhostsNewUrl + '"]').length,
       'has link to ' + appVhostsNewUrl);
  });
});

test('visit ' + appVhostsUrl + ' lists vhosts', function(){
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
    _embedded: {
      services: []
    },
    _links: {
      vhosts: { href: appVhostsApiUrl }
    }
  });

  stubRequest('get', appVhostsApiUrl, function(){
    return this.success({
      _embedded: {
        vhosts: vhosts
      }
    });
  });

  signInAndVisit(appVhostsUrl);

  andThen(function(){
    equal( find('.vhost').length, vhosts.length);

    vhosts.forEach(function(vhost){
      ok( find('.vhost .virtual-domain:contains(' + vhost.virtual_domain + ')').length,
          'has virtual domain ' + vhost.virtual_domain );

      ok( find('.vhost .external-host:contains(' + vhost.external_host + ')').length,
          'has external host ' + vhost.external_host );
    });
  });
});
