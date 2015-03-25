import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from "../helpers/fake-server";

let App;
let url = `/lkj/lj/lkjj`;

module('Acceptance: Not-Found Page', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test(`visiting ${url} shows not-found message`, function() {
  visit(url);

  andThen(function() {
    equal(currentPath(), 'not-found');
    expectLink('support.aptible.com');
    expectLink('status.aptible.com');
    expectLink('twitter.com/aptiblestatus');
  });
});
