import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
let url = '/stacks/my-stack-1/apps';
let stackId = 'my-stack-1';
let stackHandle = 'my-stack-1';

module('Acceptance: App Create', {
  beforeEach: function() {
    App = startApp();
    stubStacks({ includeApps: true });
    stubStack({
      id: stackId,
      handle: stackHandle,
      _links: {
        apps: { href: `/accounts/${stackId}/apps` },
        organization: { href: '/organizations/1' }
      }
    });
    stubOrganization();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

function findApp(appHandle){
  return find(`:contains(${appHandle})`);
}

function openModal() {
  let openButton = findWithAssert('.open-app-modal').eq(0);
  openButton.click();
}

test(`visiting ${url} with no apps shows message`, function(assert) {
  stubRequest('get', '/accounts/my-stack-1/apps', function() {
    return this.success({
      _links: {},
      _embedded: {
        apps: []
      }
    });
  });
  stubStacks({ includeApps: false });
  stubStack({ id: stackId });
  stubOrganization();

  signInAndVisit(url);
  andThen(function(){
    assert.equal(currentPath(), 'requires-authorization.enclave.stack.apps.index');
    assert.equal(find('.activate-notice:contains(has no apps)').length, 1, 'shows notice of no apps');
    assert.equal(find('.open-app-modal:contains(Create App)').length, 1, 'Shows create app button');
  });
});

test(`visit ${url} and opening create modal shows basic info`, function(assert) {
  assert.expect(6);
  stubOrganization();
  signInAndVisit(url);
  andThen(openModal);
  andThen(function(){
    assert.equal(currentPath(), 'requires-authorization.enclave.stack.apps.index', 'remain on index');
    expectInput('handle');
    expectButton('Save App');
    expectButton('Cancel');
    expectTitle(`${stackHandle} Apps`);
  });

  andThen(function() {
    expectFocusedInput('handle');
  });
});

test(`visit ${url} and cancel modal`, function(assert) {
  stubOrganization();
  let appHandle = 'abc-my-app-handle';
  signInAndVisit(url);
  andThen(openModal);
  andThen(function(){
    fillInput('handle', appHandle);
    clickButton('Cancel');
  });

  andThen(function(){
    assert.equal(currentPath(), 'requires-authorization.enclave.stack.apps.index');

    assert.ok( !findApp(appHandle).length,
        'does not show app');
  });
});

test(`visit ${url} and transition away`, function(assert) {
  stubOrganization();
  let appHandle = 'abc-my-app-handle';
  signInAndVisit(url);
  andThen(openModal);
  andThen(function(){
    fillInput('handle', appHandle);
    visit( url );
  });

  andThen(function(){
    assert.equal(currentPath(), 'requires-authorization.enclave.stack.apps.index');

    assert.ok( !findApp(appHandle).length,
        'does not show app');
  });
});

test(`visit ${url} and create an app`, function(assert) {
  stubOrganization();
  assert.expect(3);
  let appHandle = 'abc-my-app-handle';

  stubRequest('post', '/accounts/my-stack-1/apps', function(request){
    var json = this.json(request);
    assert.equal(json.handle, appHandle, 'posts app handle');

    return this.success(201, {
      id: 'my-new-app-id',
      handle: appHandle
    });
  });

  // Stub for app deploy
  stubRequest('get', '/users/:user_id/ssh_keys', function(){
    return this.success({ _embedded: { ssh_keys: [] } });
  });

  stubRequest('post', '/claims/app', function(){
    return this.success({});
  });

  signInAndVisit(url);
  andThen(openModal);
  fillInput('handle', appHandle);

  clickButton('Save App');
  andThen(function(){
    assert.equal(currentPath(), 'requires-authorization.enclave.app.deploy');

    assert.ok( findApp(appHandle).length > 0,
        'lists new app on index' );
  });
});

test(`visit ${url} and with duplicate handle`, function(assert) {
  stubOrganization();
  assert.expect(3);
  let appHandle = 'abc-my-app-handle';


  stubRequest('post', '/claims/app', function(){
    return this.error();
  });

  signInAndVisit(url);
  andThen(openModal);
  andThen(() => { fillInput('handle', appHandle); });

  andThen(function(){
    let submitButton = find('button:contains(Save App)');
    assert.ok(submitButton.length, 'has submit button');
    assert.ok(submitButton.is(':disabled'), 'submit is disabled');

    clickButton('Save App');
    assert.equal(currentPath(), 'requires-authorization.enclave.stack.apps.index');
  });
});

test(`visit ${url} when user is not verified: button is disabled`, function(assert) {
  let userData = {verified: false};
  stubOrganization();
  signInAndVisit(url, userData);
  andThen( () => {
    let createButton = findWithAssert('.btn:contains(Create App)');
    assert.ok(createButton.attr('disabled'), 'button is disabled');
  });
});
