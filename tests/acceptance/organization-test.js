import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance: Organization', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /organization', function(assert) {
  stubOrganization({ id: 'o1' });
  stubBillingDetail({ id: 'o1' });
  setFeature('organization-settings', true);
  signInAndVisit('/organizations/o1');
  andThen(function() {
    assert.equal(currentPath(), 'dashboard.organization.members.index');
    expectLink('/organizations/o1/members');
    expectLink('/organizations/o1/roles');
  });
});
