import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let locationsUrl = `/gridiron/${orgId}/admin/settings/locations`;
let roleId = 'owners-role';
let userId = 'u1';
let roles = [
  {
    id: roleId,
    type: 'owner',
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

module('Acceptance: Security Program Settings: Locations', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('Locations page, with existing location attestation', function(assert) {
  let existingAttestationData = [
    {
      description: 'HQ', streetAddress: '155 Water', city: 'Brooklyn',
      state: 'New York', zip: '10000'
    },
    {
      description: 'Satellite', streetAddress: '100 Fire', city: 'SF',
      state: 'California', zip: '20000'
    }
  ];

  stubProfile({ currentStep: 'locations' });
  stubCurrentAttestations({ workforce_locations: existingAttestationData });
  stubRequests();
  signInAndVisit(locationsUrl);

  andThen(() => {
    assert.equal(currentPath(), 'gridiron.gridiron-organization.gridiron-admin.gridiron-settings.locations', 'remains on locations step');
    assert.equal(find('.locations-index table tbody tr').length, 2, 'has two locations');
    assert.ok(find('td:contains(HQ)').length, 'Has first location');
    assert.ok(find('td:contains(Satellite)').length, 'Has second location');
  });

  andThen(openLocationDialog);

  andThen(() => {
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
  stubCurrentAttestations({ workforce_locations: [] });
  stubRequests();
  signInAndVisit(locationsUrl);

  andThen(openLocationDialog);

  andThen(() => {
    fillInLocation({ description: 'Headquarters' });
  });

  andThen(clickAddButton);

  andThen(() => {
    assert.ok(find('tr td:contains(Headquarters)').length, 'Adds a new row');
    assert.ok(find('tr td:contains(Brooklyn)').length, 'Adds a new row');
  });
});

test('Adding an incomplete location shows an error message', function(assert) {
  stubProfile({ currentStep: 'locations' });
  stubCurrentAttestations({ workforce_locations: [] });
  stubRequests();
  signInAndVisit(locationsUrl);

  andThen(openLocationDialog);

  andThen(() => {
    assert.equal(currentPath(), 'gridiron.gridiron-organization.gridiron-admin.gridiron-settings.locations', 'remains on location step');
    fillInLocation();
  });

  andThen(() => {
    fillInput('description', ''); // Unset a field
  });

  andThen(clickAddButton);

  andThen(() => {
    assert.ok(find('.alert-danger:contains(Error:)'));
  });
});

test('Clicking Save creates locations attestation', function(assert) {
  expect(3);

  let expectedDocumentItem = [{
    city: 'Brooklyn',
    description: 'HQ',
    state: 'New York',
    streetAddress: '155 Water St',
    zip: '11201'
  }];

  stubCurrentAttestations({ workforce_locations: [] });
  stubRequest('post', `/organization_profiles/${orgId}/attestations`, function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.equal(json.handle, 'workforce_locations');
    assert.deepEqual(json.document, expectedDocumentItem);
    return this.success({ id: 1 });
  });

  stubProfile({ currentStep: 'locations'});
  stubRequests();
  signInAndVisit(locationsUrl);

  andThen(openLocationDialog);
  andThen(() => { fillInLocation(); });
  andThen(clickAddButton);
  andThen(clickSaveButton);
});

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

function openLocationDialog() {
  let openButton = findWithAssert('.add-location-button');
  openButton.click();
}

function clickAddButton() {
  let addButton = findWithAssert('button[type="submit"]:contains(Add Location)');
  addButton.click();
}

function clickSaveButton() {
  let button = findWithAssert('button.save-settings');
  button.click();
}

function selectState(state) {
  findWithAssert('select[name="state"] option').filter(function() {
    return Ember.$(this).text() === state;
  }).prop('selected', true);
}

function stubRequests() {
  stubValidOrganization();
  stubSchemasAPI();
  stubProfile({ hasCompletedSetup: true });
  stubCriterionDocuments({});
  stubStacks();
  stubBillingDetail();
  stubCriteria();

  stubRequest('get', rolesHref, function() {
    return this.success({ _embedded: { roles } });
  });

  stubRequest('get', usersHref, function() {
    return this.success({ _embedded: { users }});
  });

  stubRequest('get', invitationsHref, function() {
    return this.success({ _embedded: { invitations: [] }});
  });

  stubRequest('get', securityOfficerHref, function() {
    return this.success(users[0]);
  });
}
