import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref, securityOfficerId,
         securityOfficerHref } from '../../helpers/organization-stub';

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
    assert.equal(currentPath(), 'organization.setup.locations', 'remains on locations step');
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

  andThen(clickAddButton);

  andThen(() => {
    assert.ok(find('tr td:contains(Headquarters)').length, 'Adds a new row');
    assert.ok(find('tr td:contains(Brooklyn)').length, 'Adds a new row');
  });
});

test('Visiting location page without completing previous step should return to previous step', function(assert) {
  stubProfile({ currentStep: 'organization' });
  stubRequests();
  signInAndVisit(locationsUrl);

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.organization', 'returned to organization step');
  });
});

test('Adding an incomplete location shows an error message', function(assert) {
  stubProfile({ currentStep: 'locations' });
  stubRequests();
  signInAndVisit(locationsUrl);

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.locations', 'remains on location step');
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

test('Clicking continue creates locations attestation', function(assert) {
  expect(5);

  stubRequest('post', '/attestations', function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.equal(json.handle, 'locations');

    return this.success({ id: 1 });
  });

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;

    assert.ok(true, 'updates organization profile');
    assert.equal(json.current_step, 'team');

    return this.success(json);
  });

  stubProfile({ currentStep: 'locations'});
  stubRequests();
  signInAndVisit(locationsUrl);

  andThen(() => { fillInLocation(); });
  andThen(clickAddButton);
  andThen(clickContinueButton);
  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.team', 'on next setup step');
  });
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

function clickAddButton() {
  let addButton = findWithAssert('button[type="submit"]:contains(Add)');
  addButton.click();
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

  stubRequest('get', invitationsHref, function(request) {
    return this.success({ _embedded: { invitations: [] }});
  });

  stubRequest('get', securityOfficerHref, function(request) {
    return this.success(users[0]);
  });
}
