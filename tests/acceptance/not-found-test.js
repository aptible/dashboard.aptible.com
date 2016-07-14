import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';

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
    expectLink('contact.aptible.com');
    expectLink('status.aptible.com');
    expectLink('twitter.com/aptiblestatus');

    assert.ok(find(`a[href="/"]`).length, "Has link back to /");
  });
});
