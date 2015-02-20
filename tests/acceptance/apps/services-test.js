import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;

let appId = '1';
let appUrl = '/apps/' + appId;
let appHandle = 'my-app-handle',
    stackHandle = 'my-stack-handle',
    stackId = 'my-stack-id';
let appServicesUrl = '/apps/' + appId + '/services';
let url = appServicesUrl;

module('Acceptance: App Services', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test(`${url} requires authentication`, function(){
  expectRequiresAuthentication(url);
});

test('app show page includes link to services url', function(){
  stubApp({
    id: appId,
    status: 'provisioned'
  });

  signInAndVisit(appUrl);

  andThen(function(){
    expectLink(appServicesUrl);
  });
});

test(`visit ${url} lists services`, function(){
  var services = [{
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
    equal( find('.service').length, services.length);

    services.forEach(function(service){
      ok( find('.service .process-type:contains(' + service.processType + ')').length,
          'has process type ' + service.processType );

      ok( find('.service .service-command:contains(' + service.command + ')').length,
          'has command ' + service.command );

      ok( find('.service .container-count:contains(' + service.container_count + ')').length,
          'has container count ' + service.container_count );
    });

    titleUpdatedTo(`${appHandle} Services - ${stackHandle}`);
  });
});
