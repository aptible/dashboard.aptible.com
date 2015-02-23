import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

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
    id: appId,
    status: 'provisioned'
  });

  signInAndVisit(appUrl);

  andThen(function(){
    expectLink(appVhostsUrl);
  });
});

test(`visit ${appVhostsUrl} has link to ${appVhostsNewUrl}`, function(){
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
    ok(find('a[href~="' + appVhostsNewUrl + '"]').length,
       'has link to ' + appVhostsNewUrl);
  });
  titleUpdatedTo(appHandle+' Domains - '+stackHandle);
});

test(`visit ${appVhostsUrl} lists vhosts`, function(){
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
      ok( find('.vhost .vhost-virtualdomain:contains(' + vhost.virtual_domain + ')').length,
          'has virtual domain ' + vhost.virtual_domain );

      ok( find('.vhost .external-host:contains(' + vhost.external_host + ')').length,
          'has external host ' + vhost.external_host );
    });
  });
});
