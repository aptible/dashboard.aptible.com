import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;
let stackId = 1;
let url = `/stacks/${stackId}/logging`;
let addLogUrl = `/stacks/${stackId}/logging/new`;

function findLogDrains(){
  return find('.log-drain');
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

  stubStacks({logDrains: logDrains});

  signInAndVisit(url);
  andThen(function(){
    equal(currentPath(), 'stacks.stack.log-drains.index');

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
  stubStacks();
  signInAndVisit(url);

  andThen(function(){
    click('.btn:contains(Add Log)');
  });

  andThen(function(){
    equal(currentPath(), 'stacks.stack.log-drains.new');
    equal(currentURL(), addLogUrl);

    let formEl = find('form.create-log');
    ok( formEl.length, 'has form');

    ok( formEl.find('input[name="drain-host"]').length,
        'has input for drain host' );

    ok( formEl.find('input[name="drain-port"]').length,
        'has input for drain port' );

    ok( formEl.find('.btn:contains(Cancel)').length,
        'has cancel button');

    ok( formEl.find('.btn:contains(Save Log)').length,
        'has save button');
  });
});

test(`visit ${addLogUrl} and cancel`, function(assert){
  stubStacks();

  signInAndVisit(addLogUrl);

  andThen(function(){
    equal(currentPath(), 'stacks.stack.log-drains.new');
    click('.btn:contains(Cancel)');
  });

  andThen(function(){
    equal(currentPath(), 'stacks.stack.log-drains.index');
  });
});

test(`visit ${addLogUrl} and create log success`, function(assert){
  let drainHost = 'abc-host.com',
      drainPort = '1234';

  stubStacks();

  stubRequest('post', '/log_drains', function(request){
    ok(true, 'posts to log_drains');

    let json = this.json(request);
    equal(json.drain_host, drainHost);
    equal(json.drain_port, drainPort);

    json.id = 'new-log';
    return this.success(json);
  });

  signInAndVisit(addLogUrl);
  andThen(function(){
    let formEl = find('form.create-log');
    fillIn( formEl.find('input[name="drain-host"]'), drainHost );
    fillIn( formEl.find('input[name="drain-port"]'), drainPort );

    click( formEl.find('.btn:contains(Save Log)') );
  });
  andThen(function(){
    equal(currentPath(), 'stacks.stack.log-drains.index');
  });
});

test(`visit ${addLogUrl} and create log failure`, function(assert){
  let errorMessage = 'The log drain is invalid';

  stubStacks();

  stubRequest('post', '/log_drains', function(request){
    ok(true, 'posts to log_drains');

    return this.error({ message: errorMessage });
  });

  signInAndVisit(addLogUrl);
  andThen(function(){
    let formEl = find('form.create-log');
    click( formEl.find('.btn:contains(Save Log)') );
  });
  andThen(function(){
    equal(currentPath(), 'stacks.stack.log-drains.new');
    let errorDiv = find('.alert');
    ok( errorDiv.length, 'error div is shown');
    ok( errorDiv.text().indexOf(errorMessage) > -1,
        'error message is displayed');
  });
});
