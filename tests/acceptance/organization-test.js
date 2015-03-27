import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { forcePromiseResolution } from 'diesel/organization/route';

var application;

module('Acceptance: Organization', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /organization without organizationSettings feature redirects', function(assert) {
  stubOrganization({ id: 42 });
  setFeature('organization-settings', false);
  signInAndVisit('/organizations/42');
  setTimeout(() => {
    // this is needed so that the test will not hang indefinitely waiting
    // for a promise that will never resolve
    forcePromiseResolution();
    locationUpdatedTo('http://localhost:3000/organizations/42');
  }, 0);
});

test('visiting /organization', function(assert) {
  stubOrganization({ id: 42 });
  setFeature('organization-settings', true);
  signInAndVisit('/organizations/42');
  andThen(function() {
    assert.equal(currentPath(), 'organization.members.index');

    // sidebar
    expectLink('/organizations/42/invitations');
    expectLink('/organizations/42/roles');
  });
});
