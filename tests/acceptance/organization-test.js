import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';

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
  locationUpdatedTo('http://localhost:3000/organizations/42');
});

test('visiting /organization', function(assert) {
  stubOrganization({ id: 42 });
  setFeature('organization-settings', true);
  signInAndVisit('/organizations/42');
  andThen(function() {
    assert.equal(currentPath(), 'organization.index');
  });
});
