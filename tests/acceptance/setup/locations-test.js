import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, securityOfficerId, securityOfficerHref } from '../../helpers/organization-stub';

let application;
let locationsUrl = `${orgId}/setup/locations`;
let roleId = 'owners-role';
let userId = 'u1';
let roles = [
  {
    id: roleId,
    privileged: true,
    name: 'Owners',
    _links: {
      self: { href: `/roles/${roleId}` },
      users: { href: `/roles/${roleId}/users`}
    }
  }
];

let users = [
  {
    id: userId,
    name: 'Basic User',
    email: 'basicuser@asdf.com',
    _links: {
      self: { href: `/users/${userId}` }
    }
  }
];

module('Acceptance: Setup: Locations', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('Locations page basic UI', function(assert) {
  stubProfile({ currentStep: 'locations' });
  stubRequests();
  signInAndVisit(locationsUrl);

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.locations');
    assert.ok(find('.empty-row:contains(No Locations.  Add one below.)').length,
              'shows empty row with no locations');
    assert.ok(find('button:disabled:contains(Continue)').length,
              'Continue button is disabled');
    ['description', 'streetAddress', 'city', 'zip'].forEach(function(field) {
      assert.ok(find(`input[name="${field}"]`).length, `has a ${field} field`);
    });
    assert.ok(find('select[name="state"] option').length, 50,
              'has state select with 50 options');
    assert.ok(find('button[type="submit"]:contains(Add)').length,
              'has a submit button');
  });
});

test('Adding location adds to location index', function(assert) {
  stubProfile({ currentStep: 'locations' });
  stubRequests();
  signInAndVisit(locationsUrl);

  andThen(() => {
    fillInLocation({ description: 'Headquarters' });
  });

  andThen(() => {
    let addButton = findWithAssert('button[type="submit"]:contains(Add)');
    addButton.click();
  });

  andThen(() => {
    assert.ok(find('tr td:contains(Headquarters)').length, 'Adds a new row');
    assert.ok(find('tr td:contains(Brooklyn)').length, 'Adds a new row');
  });
});

test('Visiting location page without completing previous step should return to previous step', function() {
  stubProfile({ currentStep: 'organization' });
  stubRequests();
  signInAndVisit(locationsUrl);
});

skip('Adding an incomplete location shows an error message');
skip('Clicking continue creates locations attestation');

function fillInLocation(locationData) {
  let defaultLocation = {
    description: 'HQ',
    streetAddress: '155 Water St',
    city: 'Brooklyn',
    state: 'New York',
    zip: 11201
  };

  locationData = Ember.$.extend(true, defaultLocation, locationData);

  for(var field in locationData) {
    let value = locationData[field];
    fillInput(field, value);
  }

  selectState(locationData.state);
}

function selectState(state) {
  findWithAssert('select[name="state"] option').filter(function() {
    return Ember.$(this).text() === state;
  }).prop('selected', true);
}

function stubRequests() {
  stubValidOrganization();

  stubRequest('get', rolesHref, function(request) {
    return this.success({ _embedded: { roles } });
  });

  stubRequest('get', usersHref, function(request) {
    return this.success({ _embedded: { users }});
  });

  stubRequest('get', securityOfficerHref, function(request) {
    return this.success(users[0]);
  });
}

function stubProfile(profileData) {
  stubRequest('get', `/organizationProfiles/${orgId}`, function(request) {
    profileData.id = orgId;
    return this.success(profileData);
  });
}