import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

let App;
let url = `/lkj/lj/lkjj`;

module('Acceptance: Not-Found Page', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test(`visiting ${url} shows not-found message`, function(assert) {
  visit(url);

  andThen(function() {
    assert.equal(currentPath(), 'not-found');
    expectLink('support.aptible.com');
    expectLink('status.aptible.com');
    expectLink('twitter.com/aptiblestatus');
  });
});
