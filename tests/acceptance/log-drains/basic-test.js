import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;
let stackId = 1;
let url = `/stacks/${stackId}/logging`;

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

    let logDrainEls = find('.log-drain');
    equal( logDrainEls.length, logDrains.length );

    logDrains.forEach(function(logDrain, i){
      let logDrainEl = find(`.log-drain:eq(${i})`);

      ok( logDrainEl.text().indexOf( logDrain.drain_host ) > -1,
          'shows drain host');
      ok( logDrainEl.text().indexOf( logDrain.drain_port ) > -1,
          'shows drain port');

      ok( logDrainEl.find('.btn:contains(Delete)').length,
          'has delete button' );
    });
  });
});
