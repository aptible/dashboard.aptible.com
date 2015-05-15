import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let application;
let orgId = 'o1'; // FIXME this is hardcoded to match the value for signIn in aptible-helpers
let url = `/organizations/${orgId}/roles`;
let rolesUrl = url;

module('Acceptance: Organizations: Roles', {
  beforeEach: function() {
    application = startApp();
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
    name: 'Owner',
    privileged: true
  }, {
    id: 'role2',
    name: 'devs'
  }];

  assert.expect(2 + 2*roles.length);

  stubOrganization({
    id: orgId,
    _links: { roles: {href: rolesUrl} }
  });

  stubRequest('get', rolesUrl, function(request){
    assert.ok(true, `gets ${rolesUrl}`);
    return this.success({ _embedded: { roles }});
  });

  signInAndVisit(url);
  andThen(() => {
    equal(currentPath(), 'organization.roles.index');

    roles.forEach( (r) => {
      let roleDiv = find(`.role:contains(${r.name})`);
      assert.ok(roleDiv.length, `shows role with name "${r.name}"`);

      if (r.privileged) {
        assert.ok(roleDiv.find('.fa-shield').length,
                  'privileged role is marked as such in ui');
      }
    });

    expectButton('Create role');
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
    name: 'Owner'
  };

  stubRequest('get', rolesUrl, function(request) {
    assert.ok(true, `gets ${rolesUrl}`);
    return this.success({ _embedded: {roles: [role]} });
  });
  stubStacks();

  signInAndVisit(url);
  click(`a[title="Edit ${role.name} Permissions"]`);
  andThen(() => {
    equal(currentPath(), 'organization.roles.show');
  });
});
