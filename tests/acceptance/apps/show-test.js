import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;


module('Acceptance: Apps Show', {
  beforeEach: function() {
    App = startApp();
    stubStacks();
    stubOrganizations();
    stubRequest('get', '/users/user1/ssh_keys', function(){
      return this.success({
        _embedded: {
          ssh_keys: []
        }
      });
    });
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('/apps/:id requires authentication', function() {
  expectRequiresAuthentication('/apps/1');
});

test('visiting /apps/my-app-id shows basic app info', function(assert) {
  var appId = 'my-app-id';

  let deployUserName = 'Skylar Anderson';
  let currentGitRef = 'b2bac0d8f9';
  stubOrganizations();
  stubStack({
    id: 'my-stack-1',
    handle: 'my-stack-1'
  });

  stubRequest('get', '/apps/' + appId, function(){
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
    assert.equal(currentPath(), 'dashboard.requires-read-access.app.services.index', 'show page is visited');

    let app = find('.resource-title:contains(my-app)');
    assert.ok(app.length, 'shows app handle');

    expectLink("/apps/my-app-id/activity");
    expectLink("/apps/my-app-id/vhosts");

    let lastDeployedBy = findWithAssert('.last-deployed-by');
    let expectedDate = 'February 15, 2015';

    assert.ok( lastDeployedBy.text().indexOf(deployUserName) > -1,
        `shows last deploy user name "${deployUserName}"`);
    assert.ok( lastDeployedBy.text().indexOf(expectedDate) > -1,
        `shows last deploy expectedDate "${expectedDate}"`);

    let currentGitRefEl = findWithAssert('.current-git-ref');
    assert.ok( currentGitRefEl.text().indexOf(currentGitRef) > -1,
        `shows currentGitRef "${currentGitRef}"`);

  });
});

test('visiting /apps/my-app-id when the app is deprovisioned', function(assert) {
  var appId = 'my-app-id';
  stubOrganizations();
  stubApp({id: appId, status: 'deprovisioned'});
  stubStack({ id: 'stubbed-stack' });

  signInAndVisit('/apps/' + appId);
  andThen(function() {
    var deprovisionTitle = find('.resource-metadata-value:contains(Deprovisioned)');
    assert.ok(deprovisionTitle.length, 'show deprovision title');
  });
});

test(`visit /apps/app-id shows current tab with active class`, function(assert) {
  let appId = 1;
  let appName = 'foo';
  let stackHandle = 'bar';

  stubOrganizations();
  stubApp({
    id: appId,
    handle: appName,
    status: 'provisioned',
    _links: {
      account: { href: `/accounts/${stackHandle}` }
    }
  });
  stubStacks();
  stubStack({
    id: stackHandle,
    handle: stackHandle
  });


  signInAndVisit(`/apps/${appId}`);

  andThen(() => {
    assert.equal(find('li.active a:contains(Services)').length, 1, 'Services is active');
    assert.equal(find('li.active a:contains(Endpoints)').length, 0, 'Endpoints is inactive');
    clickButton('Endpoints');
  });

  andThen(() => {
    assert.equal(find('li.active a:contains(Services)').length, 0, 'Services is inactive');
    assert.equal(find('li.active a:contains(Endpoints)').length, 1, 'Endpoints is active');
  });
});
