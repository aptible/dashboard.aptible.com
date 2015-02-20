import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

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

  let deployUserName = 'Skylar Anderson';
  let currentGitRef = 'b2bac0d8f9d5ab83ae2cc879b05cb8b61ca628ce';

  stubStack({
    id: 'my-stack-1',
    handle: 'my-stack-1'
  });

  stubRequest('get', '/apps/' + appId, function(request){
    return this.success({
      id: appId,
      handle: 'my-app',
      status: 'provisioned',
      _links: {
        account: {href: '/accounts/my-stack-1'}
      },
      _embedded: {
        services: [],
        lastDeployOperation: {
          id: 'op-1',
          user_name: deployUserName,
          git_ref: 'not-the-current-git-ref',
          created_at: '2015-02-15T19:39:11Z' // iso8601
        },
        current_image: {
          id: 'image-id',
          git_ref: currentGitRef
        }
      }
    });
  });

  signInAndVisit('/apps/' + appId);

  andThen(function() {
    equal(currentPath(), 'app.services', 'show page is visited');

    let app = find('.resource-title:contains(my-app)');
    ok(app.length, 'shows app handle');

    expectLink("/apps/my-app-id/activity");
    expectLink("/apps/my-app-id/vhosts");

    let lastDeployedBy = findWithAssert('.last-deployed-by');
    let expectedDate = 'February 15, 2015';

    ok( lastDeployedBy.text().indexOf(deployUserName) > -1,
        `shows last deploy user name "${deployUserName}"`);
    ok( lastDeployedBy.text().indexOf(expectedDate) > -1,
        `shows last deploy expectedDate "${expectedDate}"`);

    let currentGitRefEl = findWithAssert('.current-git-ref');
    ok( currentGitRefEl.text().indexOf(currentGitRef) > -1,
        `shows currentGitRef "${currentGitRef}"`);

  });
});

test('visiting /apps/my-app-id when the app is deprovisioned', function() {
  var appId = 'my-app-id';

  stubApp({id: appId, status: 'deprovisioned'});

  signInAndVisit('/apps/' + appId);
  andThen(function() {
    var deprovisionTitle = find('.resource-metadata-value:contains(Deprovisioned)');
    ok(deprovisionTitle.length, 'show deprovision title');
  });
});

test('visiting /apps/my-app-id/services shows services', function() {
  var appId = 'my-app-id';

  stubApp({
    id: appId,
    handle: 'my-app',
    status: 'provisioned',
    _links: { services: { href: '/apps/my-app-id/services' } }
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
    let servicesLink = expectLink("/apps/my-app-id/services");
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
  let appId = 'my-app-id';
  let serviceId = 'service-1';

  stubApp({
    id: appId,
    handle: 'my-app',
    _links: {
      services: { href: `/apps/${appId}/services` }
    }
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
