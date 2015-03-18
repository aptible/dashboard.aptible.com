import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';
import config from 'diesel/config/environment';

let App;
let appId = 'app-id';
let appHandle = 'my-app-handle';
let url =`/apps/${appId}`;
let gitRepo = 'git@aptible.com:my-app.git';
let gettingStartedLink = config.externalUrls.gettingStartedDocs;
let stackId = 'stack-one';

module('Acceptance: Apps Show - Never deployed (app.status === "pending")', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

function setupAjaxStubs(sshKeys){
  stubApp({
    id: appId,
    handle: appHandle,
    status: 'pending',
    git_repo: gitRepo,
    _links: {
      stack: {href: `/accounts/${stackId}`}
    }
  });

  stubRequest('get', '/users/:user_id/ssh_keys', function(request){
    return this.success({ _embedded: { ssh_keys: sshKeys } });
  });
}

function findStep(index){
  return find('.panel-step:eq(' + index + ')');
}

function expectTab(tabName){
  if (!findTab(tabName).length) {
    ok(false, `Could not find tab named ${tabName}`);
  } else {
    ok(true, `Found tab named ${tabName}`);
  }
}

function findTab(tabName){
  return find(`.resource-navigation li:contains(${tabName})`);
}

function expectNoTab(tabName){
  if (findTab(tabName).length) {
    ok(false, `Expected not to find tab ${tabName}`);
  } else {
    ok(true, `Found no tab ${tabName}`);
  }
}

function expectNoTabs() {
  ok(!!find('.resource-navigation'), 'has no tabs');
}

test(`visit ${url} when app has not been deployed`, function(assert){
  let sshKeys = [];
  setupAjaxStubs(sshKeys);

  signInAndVisit(url);
  andThen(function(){
    equal(currentPath(), 'app.deploy');

    ok( find(`.first-time-app-deploy h2:contains(${appHandle})`).length,
        'display app handle');

    // displayed tabs
    //expectTab('Deploy');
    //expectTab('Activity');
    //expectTab('Deprovision');

    // hidden tabs
    //expectNoTab('Services');
    //expectNoTab('Domains');

    // displayed steps

    expectNoTabs();

    let steps = [
      {title: 'Add your SSH Key', links: ['settings/ssh', gettingStartedLink]},
      {title: 'Add a Procfile to your App', links:[gettingStartedLink]},
      {title: 'Git Push to Aptible', contains: [gitRepo]}
    ];

    steps.forEach(function(step, i){
      let stepEl = findStep(i);

      let title = stepEl.find(`:contains(${step.title})`);
      ok(title.length, `has title ${step.title} in position ${i}`);

      ok( stepEl.find(`.panel-step-num:contains(${i+1})`).length,
          `panel at position ${i} has number ${i+1}`);

      if (step.contains) {
        step.contains.forEach(function(text){
          ok( stepEl.find(`*:contains(${text})`).length,
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

    ok( sshKeyNumber.find('i.fa-check').length,
        'ssh key step number has checkmark');

    expectNoLink('settings/ssh', {context: sshKeyStep});
  });
});

test(`visit ${url} when app has not been deployed, click destroy link`, function(assert){
  expect(2);

  stubRequest('delete', `/apps/${appId}`, function(request){
    ok(true, 'app is deleted');
    return this.noContent();
  });

  stubStack({
    id: stackId
  });

  setupAjaxStubs([]);
  signInAndVisit(url);

  click(`a:contains(Destroy ${appHandle})`);
  andThen(function(){
    equal(currentPath(), 'stack.apps.new', 'redirected to apps');
  });
});
