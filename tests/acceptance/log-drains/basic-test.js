import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;
let stackId = 'my-stack-1';
let url = `/stacks/${stackId}/logging`;
let addLogUrl = `/stacks/${stackId}/logging/new`;

function findLogDrains(){
  return find('.log-drain');
}

function expectInput(inputName, context){
  let el = findInput(inputName, context);
  ok(el.length, `found input named ${inputName}`);
}

function findInput(inputName, context){
  return context.find(`input[name="${inputName}"]`);
}

module('Acceptance: Log Drains Show', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
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

  stubStack({ id: 'my-stack-1', _embedded: { log_drains: logDrains }});
  stubOrganization();
  stubStacks({logDrains: logDrains});
  signInAndVisit(url);

  andThen(function(){
    equal(currentPath(), 'stack.log-drains.index');

    ok( find('.btn:contains(Add Log)').length,
        'button to add log');

    let logDrainEls = findLogDrains();
    equal( logDrainEls.length, logDrains.length );

    logDrains.forEach(function(logDrain, i){
      let logDrainEl = find(`.log-drain:eq(${i})`);
      ok( logDrainEl.text().indexOf( logDrain.drain_host ) > -1,
          'shows drain host');
      ok( logDrainEl.text().indexOf( logDrain.drain_port ) > -1,
          'shows drain port');
    });
  });
});

test(`visit ${url} and click add log shows form`, function(assert){
  stubOrganization();
  stubStacks();
  stubStack({ id: 'my-stack-1'});
  signInAndVisit(url);

  andThen(function(){
    click('.btn:contains(Add Log)');
  });

  andThen(function(){
    equal(currentPath(), 'stack.log-drains.new');
    equal(currentURL(), addLogUrl);

    let formEl = find('form.create-log');
    ok( formEl.length, 'has form');

    expectInput('drain-host', formEl);
    expectInput('drain-port', formEl);
    expectInput('handle', formEl);
    expectInput('drain-type', formEl);
  });
});

test(`visit ${addLogUrl} and cancel`, function(assert){
  stubOrganization();
  stubStacks();
  stubStack({ id: 'my-stack-1'});
  signInAndVisit(addLogUrl);

  andThen(function(){
    equal(currentPath(), 'stack.log-drains.new');
    click('.btn:contains(Cancel)');
  });

  andThen(function(){
    equal(currentPath(), 'stack.log-drains.index');
  });
});

test(`visit ${addLogUrl} and create log success`, function(assert){
  expect(6);

  let drainHost = 'abc-host.com',
      drainPort = '1234',
      handle = 'my-log-name',
      drainType = 'elasticsearch';

  stubOrganization();
  stubStacks();
  stubStack({ id: 'my-stack-1'});
  stubRequest('post', '/accounts/:stack_id/log_drains', function(request){
    ok(true, 'posts to log_drains');

    let json = this.json(request);
    equal(json.drain_host, drainHost);
    equal(json.drain_port, drainPort);
    equal(json.drain_type, drainType);
    equal(json.handle, handle);

    json.id = 'new-log';
    return this.success(json);
  });

  signInAndVisit(addLogUrl);
  andThen(function(){
    let formEl = find('form.create-log');

    fillIn( findInput('drain-host', formEl), drainHost);
    fillIn( findInput('drain-port', formEl), drainPort);
    click( findInput('drain-type', formEl) ); // click radio button
    fillIn( findInput('handle', formEl), handle);
    click( formEl.find('.btn:contains(Save Log)') );
  });

  andThen(function(){
    equal(currentPath(), 'stack.log-drains.index');
  });
});

test(`visit ${addLogUrl} and create log failure`, function(assert){
  let errorMessage = 'The log drain is invalid';

  stubOrganization();
  stubStacks();
  stubStack({ id: 'my-stack-1'});

  stubRequest('post', '/accounts/:stack_id/log_drains', function(request){
    ok(true, 'posts to log_drains');

    return this.error({ message: errorMessage });
  });

  signInAndVisit(addLogUrl);
  andThen(function(){
    let formEl = find('form.create-log');
    click( formEl.find('.btn:contains(Save Log)') );
  });
  andThen(function(){
    equal(currentPath(), 'stack.log-drains.new');
    let errorDiv = find('.alert');
    ok( errorDiv.length, 'error div is shown');
    ok( errorDiv.text().indexOf(errorMessage) > -1,
        'error message is displayed');
  });
});
