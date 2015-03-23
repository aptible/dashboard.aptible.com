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
  let currentGitRef = 'b2bac0d8f9';
  stubOrganizations();
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
  stubOrganizations();
  stubApp({id: appId, status: 'deprovisioned'});

  signInAndVisit('/apps/' + appId);
  andThen(function() {
    var deprovisionTitle = find('.resource-metadata-value:contains(Deprovisioned)');
    ok(deprovisionTitle.length, 'show deprovision title');
  });
});
