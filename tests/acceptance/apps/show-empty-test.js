import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';
import config from 'diesel/config/environment';

let App;
let appId = 'app-id';
let url =`/apps/${appId}`;
let gitRepo = 'git@aptible.com:my-app.git';
let gettingStartedLink = config.externalUrls.gettingStartedDocs;

module('Acceptance: Apps Show - Never deployed (app.status === "pending")', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

function setupAjaxStubs(sshKeys){
  stubRequest('get', '/apps/:app_id', function(request){
    return this.success({
      id: request.params.app_id,
      status: 'pending',
      git_repo: gitRepo
    });
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

test(`visit ${url} when app has not been deployed`, function(assert){
  let sshKeys = [];
  setupAjaxStubs(sshKeys);

  signInAndVisit(url);
  andThen(function(){
    equal(currentPath(), 'app.deploy');

    // displayed tabs
    expectTab('Deploy');
    expectTab('Activity');
    expectTab('Deprovision');

    // hidden tabs
    expectNoTab('Services');
    expectNoTab('Domains');

    // displayed steps
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
