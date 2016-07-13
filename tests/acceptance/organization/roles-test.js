import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let application;
let orgId = 1;
let url = `/organizations/${orgId}/roles`;
let rolesUrl = url;

module('Acceptance: Organizations: Roles', {
  beforeEach: function() {
    application = startApp();
    stubRequest('get', '/organizations', function(){
      return this.success({
        _links: {},
        _embedded: {
          organizations: [{
            _links: {
              roles: { href: rolesUrl },
              self: { href: `/organizations/${orgId}` }
            },
            id: orgId,
            name: 'Sprocket Co',
            type: 'organization'
          }]
        }
      });
    });
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  expectRequiresAuthentication(url);
});

test(`visiting ${url} shows roles`, (assert) => {
  stubStacks();
  let roles = [{
    id: 'role1',
    name: 'Account Owner',
    type: 'owner',
    _links: {
      self: { href: `/roles/role1` },
      organization: { href: `/organizations/${orgId}` }
    }
  }, {
    id: 'role2',
    name: 'Platform Owner',
    type: 'platform_owner',
    _links: {
      self: { href: `/roles/role3` },
      organization: { href: `/organizations/${orgId}` }
    }
  }, {
    id: 'role3',
    name: 'devs',
    type: 'platform_user',
    _links: {
      self: { href: `/roles/role2` },
      organization: { href: `/organizations/${orgId}` }
    }
  }];

  assert.expect(6);

  stubOrganization({
    id: orgId,
    _links: {
      roles: { href: rolesUrl },
      self: { href: `/organizations/${orgId}` }
    }
  });

  stubRequest('get', rolesUrl, function(){
    assert.ok(true, `gets ${rolesUrl}`);
    return this.success({ _embedded: { roles }});
  });

  signInAndVisit(url, {}, roles[0]);

  andThen(() => {
    assert.equal(currentPath(), 'dashboard.requires-read-access.organization.roles.platform');

    roles.forEach( (r) => {
      let roleDiv = find(`.role-details__heading:contains(${r.name})`);
      assert.ok(roleDiv.length, `shows role with name "${r.name}"`);

      if (r.isOwner) {
        assert.ok(roleDiv.find('.fa-shield').length,
                  'owner roles are marked as such in ui');
      }
    });

    expectButton('Create Role');
  });
});

test(`visit ${url} and click to show`, (assert) => {
  stubStacks();
  assert.expect(2);
  stubOrganization({
    id: orgId,
    _links: {
      roles: {href: rolesUrl}
    }
  });
  let role = {
    id: 'role1',
    name: 'Dev',
    type: 'platform_user'
  };

  stubRequest('get', rolesUrl, function() {
    assert.ok(true, `gets ${rolesUrl}`);
    return this.success({ _embedded: {roles: [role]} });
  });
  stubStacks();

  signInAndVisit(url);
  click(`a[title="Edit ${role.name} Permissions"]`);
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.requires-read-access.role.members');
  });
});
