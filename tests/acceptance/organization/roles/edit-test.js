import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import {stubRequest} from 'diesel/tests/helpers/fake-server';

let application;
let orgId = 'o1'; // FIXME this is hardcoded to match the value for signIn in aptible-helpers
let roleId = 'r1';
let roleName = 'the-role';
let url = `/organizations/${orgId}/roles/${roleId}/edit`;
let apiRoleUrl = `/roles/${roleId}`;

module('Acceptance: Organizations: Roles Edit', {
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

test(`visiting ${url} lists permissions by stack`, (assert)=> {
  let orgUrl = `/organizations/${orgId}`;
  stubOrganization({
    id: orgId,
    _links: {
      self: { href: orgUrl }
    }
  });

  let stackHandle = 'stack1-handle';
  let scopes = ['Read', 'Manage'];

  let permissions = [{
    id: 'p1',
    scope: 'read',
    _links: {
      role: { href: '/some/other/role' }
    }
  }];

  let stackId = 'stack1';
  let stacks = [{
    id: stackId,
    handle: stackHandle,
    _links: {
      organization: { href: orgUrl }
    }
  }];
  stubStacks({}, stacks);

  stubRequest('get', apiRoleUrl, function(request){
    return this.success({
      id: roleId,
      name: roleName,
      _links: { self: { href: apiRoleUrl } }
    });
  });

  let postedPermission;
  let createPermissionUrl = `/accounts/${stackId}/permissions`;
  stubRequest('post', createPermissionUrl, function(request){
    postedPermission = true;

    // the first checkbox is 'read' scope, hardcoded by the template
    assert.equal(this.json(request).scope, 'read',
                 `posts with scope read`);
    assert.equal(this.json(request).role_url, apiRoleUrl,
                 `posts with role url`);
    return this.success({});
  });

  signInAndVisit(url);

  andThen(() => {
    assert.ok(find(`:contains(${stackHandle})`).length,
              'has stack handle');

    scopes.forEach((s) => {
      assert.ok(find(`:contains(${s})`).length,
                `has "${s}" scope`);
    });

    assert.equal(find(`input[type="checkbox"]:not(:checked)`).length, scopes.length*stacks.length,
                 'has an unchecked checkbox for each scope');
  });
  click(`input[type="checkbox"]:eq(0)`);
  andThen(() => {
    assert.ok(!postedPermission, 'did not hit server yet');

    clickButton('Update Role');
  });
  andThen(() => {
    assert.ok(postedPermission, 'posts to server');
  });
});

test(`visiting ${url} lists permissions by stack, checked boxes when permissions are present`, (assert)=> {
  let orgUrl = `/organizations/${orgId}`;
  stubOrganization({
    id: orgId,
    _links: {
      self: { href: orgUrl }
    }
  });

  let stackHandle = 'stack1-handle';
  let scopes = ['Read', 'Manage'];
  let permissions = [{
    id: 'p1',
    scope: 'read',
    _links: {
      role: { href: apiRoleUrl },
    }
  }, {
    id: 'p2',
    scope: 'manage',
    _links: {
      role: { href: apiRoleUrl },
    }
  }];

  let stackId = 'stack1';
  let stacks = [{
    id: stackId,
    handle: stackHandle,
    _links: {
      organization: { href: orgUrl },
    },
    _embedded: {
      permissions
    }
  }];
  stubStacks({}, stacks);

  stubRequest('get', apiRoleUrl, function(request){
    return this.success({
      id: roleId,
      name: roleName
    });
  });

  let deletedPermission;
  let expectedPermissionId = permissions[0].id;
  let deletePermissionUrl  = `/permissions/${expectedPermissionId}`;
  stubRequest('delete', deletePermissionUrl, function(request){
    deletedPermission = true;
    return this.noContent();
  });

  signInAndVisit(url);

  andThen(() => {
    assert.ok(find(`:contains(${stackHandle})`).length,
              'has stack handle');

    scopes.forEach((s) => {
      assert.ok(find(`:contains(${s})`).length,
                `has "${s}" scope`);
    });

    assert.equal(find(`input[type="checkbox"]:checked`).length, scopes.length*stacks.length,
                 'has a checked checkbox for each scope');
  });
  click(`input[type="checkbox"]:eq(0)`);
  andThen(() => {
    assert.ok(!deletedPermission, 'did not hit server yet');

    clickButton('Update Role');
  });
  andThen(() => {
    assert.ok(deletedPermission, 'deletes to server');
  });
});
