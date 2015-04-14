import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;

let stackHandle = 'my-stack-handle',
    stackId = 'my-stack-id',
    orgName = 'my org',
    orgId = 'org-1',
    url = `stacks/${stackId}/logging`,
    addLogUrl = `/stacks/${stackId}/logging/new`;

module('Acceptance: Log Drains', {
  setup: function() {
    App = startApp();
    stubOrganizations();
    stubStacks();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  },
  prepareStubs: function(options){
    let defaultLogDrains = [{
      id: 'drain-1',
      handle: 'first-drain',
      drain_host: 'abcdef.com',
      drain_port: 123
    }];
    options = options || {logDrains: defaultLogDrains};

    stubStack({
      id: stackId,
      handle: stackHandle,
      _embedded: { log_drains: options.logDrains },
      _links: { organization: { href: `/organizations/${orgId}` } }
    });
    stubOrganization({id: orgId, name: orgName});
  }
});

test(`visit ${url} requires authentication`, function(assert){
  expectRequiresAuthentication(url);
});

test(`visit ${url} shows basic info`, function(assert){
  let logDrains = [{
    id: 'drain-1',
    handle: 'first-drain',
    drain_host: 'abcdef.com',
    drain_port: 123
  }, {
    id: 'drain-2',
    handle: 'second-drain',
    drain_host: 'second.com',
    drain_port: 456
  }];
  this.prepareStubs({logDrains});

  signInAndVisit(url);

  andThen(function(){
    equal(currentPath(), 'stack.log-drains.index');

    expectButton('Add Log');

    let logDrainEls = find('.log-drain');
    equal( logDrainEls.length, logDrains.length );

    logDrains.forEach(function(logDrain, i){
      let logDrainEl = find(`.log-drain:eq(${i})`);
      ok( logDrainEl.text().indexOf( logDrain.drain_host ) > -1,
          'shows drain host');
      ok( logDrainEl.text().indexOf( logDrain.drain_port ) > -1,
          'shows drain port');
      expectTitle(`${stackHandle} Logging - ${orgName}`);
    });
  });
});

test(`visit ${url} with no log drains will redirect to new log drains`, function() {
  this.prepareStubs({logDrains:[]});
  signInAndVisit(url);

  andThen(function() {
    equal(currentPath(), 'stack.log-drains.new');
  });
});

test(`visit ${url} with log drains and click add log shows form`, function(assert){
  this.prepareStubs();
  signInAndVisit(url);

  andThen(function(){
    clickButton('Add Log');
  });

  andThen(function(){
    equal(currentPath(), 'stack.log-drains.new');
    equal(currentURL(), addLogUrl);

    let formEl = find('form.create-log');
    ok( formEl.length, 'has form');

    let context = formEl;
    expectInput('drain-host', {context});
    expectInput('drain-port', {context});
    expectInput('handle', {context});
    expectInput('drain-type', {context});
    expectFocusedInput('handle', {context});

    expectButton('Save Log Drain');
    expectButton('Cancel');
  });
});

test(`visit ${addLogUrl} and cancel`, function(assert){
  this.prepareStubs();
  signInAndVisit(addLogUrl);

  andThen(function(){
    equal(currentPath(), 'stack.log-drains.new');
    clickButton('Cancel');
  });

  andThen(function(){
    equal(currentPath(), 'stack.log-drains.index');
  });
});

test(`visit ${addLogUrl} and create log success`, function(assert){
  expect(7);
  this.prepareStubs();

  let drainHost = 'abc-host.com',
      drainPort = '1234',
      handle = 'my-log-name',
      drainType = 'elasticsearch',
      logDrainId = 'log-id-1';

  stubRequest('post', '/accounts/:stack_id/log_drains', function(request){
    ok(true, 'posts to log_drains');

    let json = this.json(request);
    equal(json.drain_host, drainHost);
    equal(json.drain_port, drainPort);
    equal(json.drain_type, drainType);
    equal(json.handle, handle);

    json.id = logDrainId;
    return this.success(json);
  });

  stubRequest('post', `/log_drains/${logDrainId}/operations`, function(request){
    let json = this.json(request);
    equal(json.type, 'configure', 'creates configure operation');
    return this.success();
  });

  signInAndVisit(addLogUrl);
  andThen(function(){
    let formEl = find('form.create-log');
    let context = formEl;

    fillInput('drain-host', drainHost, {context});
    fillInput('drain-port', drainPort, {context});
    click( findInput('drain-type', {context}) ); // click radio button
    fillInput('handle', handle, {context});
    clickButton('Save Log', {context});
  });

  andThen(function(){
    equal(currentPath(), 'stack.log-drains.index');
  });
});

test(`visit ${addLogUrl} and create log failure`, function(assert){
  this.prepareStubs();
  let errorMessage = 'The log drain is invalid';

  stubRequest('post', '/accounts/:stack_id/log_drains', function(request){
    ok(true, 'posts to log_drains');

    return this.error({ message: errorMessage });
  });

  signInAndVisit(addLogUrl);
  andThen(function(){
    let formEl = find('form.create-log');
    clickButton('Save Log', {context:formEl});
  });
  andThen(function(){
    equal(currentPath(), 'stack.log-drains.new');
    let errorDiv = find('.alert');
    ok( errorDiv.length, 'error div is shown');
    ok( errorDiv.text().indexOf(errorMessage) > -1,
        'error message is displayed');
  });
});

test(`visit ${addLogUrl} when unverified shows cannot create message`, function(){
  this.prepareStubs();
  let userData = {verified: false};
  signInAndVisit(addLogUrl, userData);
  andThen( () => {
    expectNoButton('Save Log Drain');
    expectNoButton('Cancel');
    let message = find('.activate-panel h1');
    ok(message.text().indexOf('Cannot create a new log') > -1,
       'shows cannot create log message');
  });
});
