import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

var appId = '1';
var appUrl = '/apps/' + appId;
var appServicesUrl = '/apps/' + appId + '/services';

module('Acceptance: App Services', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test(appServicesUrl + ' requires authentication', function(){
  expectRequiresAuthentication(appServicesUrl);
});

test('app show page includes link to services url', function(){
  stubApp({
    id: appId
  });

  signInAndVisit(appUrl);

  andThen(function(){
    ok(find('a[href~="' + appServicesUrl + '"]').length,
       'has link to ' + appServicesUrl);
  });
});

test('visit ' + appServicesUrl + ' lists services', function(){
  var services = [{
    id: 1,
    handle: 'hubot',
    command: 'bin/exec hubot',
    container_count: 1
  },{
    id: 2,
    handle: 'web',
    command: 'bundle exec rails s -e $PORT',
    container_count: 2
  }];

  stubApp({
    id: appId,
    _embedded: {
      services: services
    }
  });

  signInAndVisit(appServicesUrl);

  andThen(function(){
    equal( find('.service').length, services.length);

    services.forEach(function(service){
      ok( find('.service .handle:contains(' + service.handle + ')').length,
          'has handle ' + service.handle );

      ok( find('.service .command:contains(' + service.command + ')').length,
          'has command ' + service.command );

      ok( find('.service .container-count:contains(' + service.container_count + ')').length,
          'has container count ' + service.container_count );
    });
  });
});
