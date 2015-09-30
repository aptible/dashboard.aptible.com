import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';
import config from 'diesel/config/environment';

let App;
let appId = 'app-id';
let appHandle = 'my-app-handle';
let url =`/apps/${appId}`;
let deployStepsUrl = `${url}/deploy`;
let gitRepo = 'git@aptible.com:my-app.git';
let gettingStartedLink = config.externalUrls.gettingStartedDocs;
let stackId = 'stack-one';

module('Acceptance: Apps Show - Never deployed (app.status === "pending")', {
  beforeEach: function(assert) {
    App = startApp();
    assert.expectTab = expectTab;
    assert.expectNoTab = expectNoTab;
    assert.expectNoTabs = expectNoTabs;
    stubStacks();
    stubOrganizations();
  },

  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

function setupAjaxStubs(sshKeys){
  stubOrganizations();
  stubOrganization();
  stubStack({ id: 'stubbed-stack' });
  stubApp({
    id: appId,
    handle: appHandle,
    status: 'pending',
    git_repo: gitRepo,
    _links: {
      stack: {href: `/accounts/${stackId}`}
    }
  });

  stubRequest('get', '/users/:user_id/ssh_keys', function(){
    return this.success({ _embedded: { ssh_keys: sshKeys } });
  });
}

function findStep(index){
  return find('.panel-step:eq(' + index + ')');
}

function expectTab(tabName){
  if (!findTab(tabName).length) {
    this.ok(false, `Could not find tab named ${tabName}`);
  } else {
    this.ok(true, `Found tab named ${tabName}`);
  }
}

function findTab(tabName){
  return find(`.resource-navigation li:contains(${tabName})`);
}

function expectNoTab(tabName){
  if (findTab(tabName).length) {
    this.ok(false, `Expected not to find tab ${tabName}`);
  } else {
    this.ok(true, `Found no tab ${tabName}`);
  }
}

function expectNoTabs() {
  this.ok(!!find('.resource-navigation'), 'has no tabs');
}

test(`visit ${url} when app has not been deployed`, function(assert){
  let sshKeys = [];
  setupAjaxStubs(sshKeys);

  signInAndVisit(url);
  andThen(function(){
    assert.equal(currentPath(), 'dashboard.app.deploy');

    assert.ok( find(`.first-time-app-deploy h2:contains(${appHandle})`).length,
        'display app handle');

    // displayed tabs
    //expectTab('Deploy');
    //expectTab('Activity');
    //expectTab('Deprovision');

    // hidden tabs
    //expectNoTab('Services');
    //expectNoTab('Domains');

    // displayed steps

    assert.expectNoTabs();

    let steps = [
      {title: 'Add your SSH Key', links: ['settings/ssh', gettingStartedLink]},
      {title: 'Add a Procfile to your App', links:[gettingStartedLink]},
      {title: 'Git Push to Aptible', contains: [gitRepo]}
    ];

    steps.forEach(function(step, i){
      let stepEl = findStep(i);

      let title = stepEl.find(`:contains(${step.title})`);
      assert.ok(title.length, `has title ${step.title} in position ${i}`);

      assert.ok( stepEl.find(`.panel-step-num:contains(${i+1})`).length,
          `panel at position ${i} has number ${i+1}`);

      if (step.contains) {
        step.contains.forEach(function(text){
          assert.ok( stepEl.find(`*:contains(${text})`).length,
              `step ${i} contains "${text}"`);
        });
      }

      if (step.links) {
        step.links.forEach(function(link){
          expectLink(link, {context:stepEl});
        });
      }
    });
  });
});

test(`visit ${url} when user has ssh keys`, function(assert){
  let sshKeys = [ {id: 'ssh-key-1'} ];
  setupAjaxStubs(sshKeys);

  signInAndVisit(url);
  andThen(function(){
    let sshKeyStep = findStep(0);
    let sshKeyNumber = sshKeyStep.find('.panel-step-num');

    assert.ok( sshKeyNumber.find('i.fa-check').length,
        'ssh key step number has checkmark');

    expectNoLink('settings/ssh', {context: sshKeyStep});
  });
});

test(`visit ${url} when app has not been deployed, click destroy link`, function(assert){
  assert.expect(2);

  stubRequest('delete', `/apps/${appId}`, function(){
    assert.ok(true, 'app is deleted');
    return this.noContent();
  });

  stubStack({
    id: stackId
  });
  stubStacks();

  setupAjaxStubs([]);
  signInAndVisit(url);

  click(`a:contains(Destroy ${appHandle})`);
  andThen(function(){
    assert.equal(currentPath(), 'dashboard.stack.apps.new', 'redirected to apps');
  });
});


test(`visit ${deployStepsUrl} with app services should redirect to services page`, function(assert){
  assert.expect(1);

  stubStack({
    id: stackId
  });
  stubStacks();

  stubOrganizations();
  stubOrganization();
  stubStack({ id: 'stubbed-stack' });
  stubApp({
    id: appId,
    handle: appHandle,
    status: 'provisioned',
    git_repo: gitRepo,
    _embedded: {
      services: [{
        id: 3,
        handle: "foundry-worker-service",
        process_type: "worker",
        command: "bundle exec sidekiq",
        container_count: 1,
      }]
    },
    _links: {
      stack: {href: `/accounts/${stackId}` }
    }
  });

  stubRequest('get', '/users/:user_id/ssh_keys', function(){
    return this.success({ _embedded: { ssh_keys: [] } });
  });

  signInAndVisit(deployStepsUrl);

  andThen(function(){
    assert.equal(currentPath(), 'dashboard.app.services', 'redirected to app services');
  });
});

