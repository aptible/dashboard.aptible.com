import Ember from 'ember';
import {module, test} from 'qunit';
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
  beforeEach: function() {
    App = startApp();
    stubOrganizations();
    stubStacks();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  },
  prepareStubs: function(options, databasesPayload){
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
      _links: {
        organization: { href: `/organizations/${orgId}`},
        databases: { href: `/accounts/${stackId}/databases` }
     }
    });

    databasesPayload = databasesPayload || [{id: 'db-1', type: 'elasticsearch'}];
    stubStackDatabases(stackId, databasesPayload);
    stubOrganization({id: orgId, name: orgName});
  }
});

test(`visit ${url} requires authentication`, function(){
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
    assert.equal(currentPath(), 'dashboard.stack.log-drains.index');

    expectButton('Add Log');

    let logDrainEls = find('.log-drain');
    assert.equal( logDrainEls.length, logDrains.length );

    logDrains.forEach(function(logDrain, i){
      let logDrainEl = find(`.log-drain:eq(${i})`);
      assert.ok( logDrainEl.text().indexOf( logDrain.drain_host ) > -1,
          'shows drain host');
      assert.ok( logDrainEl.text().indexOf( logDrain.drain_port ) > -1,
          'shows drain port');
      expectTitle(`${stackHandle} Logging - ${orgName}`);
    });
  });
});

test(`visit ${url} with no log drains will redirect to new log drains`, function(assert) {
  this.prepareStubs({logDrains:[]});
  signInAndVisit(url);

  andThen(function() {
    assert.equal(currentPath(), 'dashboard.stack.log-drains.new');
  });
});

test(`visit ${url} with log drains and click add log shows form`, function(assert){
  this.prepareStubs();
  signInAndVisit(url);

  andThen(function(){
    clickButton('Add Log');
  });

  andThen(function(){
    assert.equal(currentPath(), 'dashboard.stack.log-drains.new');
    assert.equal(currentURL(), addLogUrl);

    let formEl = find('form.create-log');
    assert.ok( formEl.length, 'has form');

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
    assert.equal(currentPath(), 'dashboard.stack.log-drains.new');
    clickButton('Cancel');
  });

  andThen(function(){
    assert.equal(currentPath(), 'dashboard.stack.log-drains.index');
  });
});

test(`visit ${addLogUrl} and create log success`, function(assert){
  assert.expect(7);

  this.prepareStubs();

  let drainHost = 'abc-host.com',
      drainPort = '1234',
      handle = 'my-log-name',
      drainType = 'elasticsearch',
      logDrainId = 'log-id-1';

  stubRequest('post', '/accounts/:stack_id/log_drains', function(request){
    assert.ok(true, 'posts to log_drains');

    let json = this.json(request);
    assert.equal(json.drain_host, drainHost);
    assert.equal(json.drain_port, drainPort);
    assert.equal(json.drain_type, drainType);
    assert.equal(json.handle, handle);

    json.id = logDrainId;
    return this.success(json);
  });

  stubRequest('post', `/log_drains/${logDrainId}/operations`, function(request){
    let json = this.json(request);
    assert.equal(json.type, 'configure', 'creates configure operation');
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
    assert.equal(currentPath(), 'dashboard.stack.log-drains.index');
  });
});

test(`visit ${addLogUrl} and create log to elasticsearch`, function(assert){
  assert.expect(7);

  let drainUser = 'someUser',
      drainPassword = 'somePw',
      drainHost = 'abc-host.com',
      drainPort = '1234',
      drainType = 'elasticsearch',
      logDrainId = 'log-drain-foo',
      databaseHandle = 'databaseHandle';

  let databasesPayload = [
    {
      id: 'db-1',
      type: 'elasticsearch',
      handle: 'do-not-pick-me',
      connection_url: `http:\/\/user:password@foo-bar.com:4567`
    }, {
      id: 'db-2',
      type: 'elasticsearch',
      handle: databaseHandle,
      connection_url: `http:\/\/${drainUser}:${drainPassword}@${drainHost}:${drainPort}`
    }
  ];
  this.prepareStubs(null, databasesPayload);

  stubRequest('post', '/accounts/:stack_id/log_drains', function(request){
    assert.ok(true, 'posts to log_drains');

    let json = this.json(request);

    assert.equal(json.drain_host, drainHost);
    assert.equal(json.drain_port, drainPort);
    assert.equal(json.drain_type, drainType);
    assert.equal(json.drain_password, drainPassword);
    assert.equal(json.drain_username, drainUser);

    json.id = logDrainId;
    return this.success(json);
  });

  stubRequest('post', `/log_drains/${logDrainId}/operations`, function(){
    return this.success();
  });

  signInAndVisit(addLogUrl);
  andThen(function(){
    let formEl = find('form.create-log');
    let context = formEl;

    click( find('label:contains(Elasticsearch)')); // click elasticsearch radio button
    fillInput('handle', 'handle', { context });
    fillInput('database-selector', 'db-2');
    clickButton('Save Log', {context});
  });

  andThen(function(){
    assert.equal(currentPath(), 'dashboard.stack.log-drains.index');
  });
});

test(`visit ${addLogUrl} and create log failure`, function(assert){
  this.prepareStubs();
  let errorMessage = 'The log drain is invalid';

  stubRequest('post', '/accounts/:stack_id/log_drains', function(){
    assert.ok(true, 'posts to log_drains');

    return this.error({ message: errorMessage });
  });

  signInAndVisit(addLogUrl);
  andThen(function(){
    let formEl = find('form.create-log');
    clickButton('Save Log', {context:formEl});
  });
  andThen(function(){
    assert.equal(currentPath(), 'dashboard.stack.log-drains.new');
    let errorDiv = find('.alert');
    assert.ok( errorDiv.length, 'error div is shown');
    assert.ok( errorDiv.text().indexOf(errorMessage) > -1,
        'error message is displayed');
  });
});

test(`visit ${addLogUrl} when unverified shows cannot create message`, function(assert) {
  this.prepareStubs();
  let userData = {verified: false};
  signInAndVisit(addLogUrl, userData);
  andThen( () => {
    expectNoButton('Save Log Drain');
    expectNoButton('Cancel');
    let message = find('.activate-notice h1');
    assert.ok(message.text().indexOf('Cannot create a new log') > -1,
       'shows cannot create log message');
  });
});
