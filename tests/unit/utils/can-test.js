import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';
import Ember from "ember";
import can from "dummy/utils/can";

let store;

moduleForModel('user', 'Utils - #can', {
  needs: modelDeps,
  setup: function(){
    store = this.store();
  },
  teardown: function(){
    Ember.run(store, 'destroy');
  }
});

test('user and stack have same role, stack\'s permission has "manage" scope', function(assert) {
  var user, userRole, stack, stackPermission;

  Ember.run(function(){
    user     = store.push('user', {id:'u1', roles:['r1'], verified: true});
    userRole = store.push('role', {id:'r1'});

    stack    = store.push('stack', {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {
      id:'p1',
      scope:'manage',
      links: {
        role: '/roles/r1'
      }
    });
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      assert.ok(res, 'user can manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      assert.ok(res, 'user can read stack');
    });
  });
});

test('user and stack have same role, stack\'s permission has "read" scope', function(assert) {
  var user, userRole, stack, stackPermission;

  Ember.run(function(){
    user     = store.push('user', {id:'u1', roles:['r1'], verified: true});
    userRole = store.push('role', {id:'r1'});

    stack    = store.push('stack', {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {
      id:'p1',
      scope:'read',
      links: {
        role: '/roles/r1'
      }
    });
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      assert.ok(!res, 'user can not manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      assert.ok(res, 'user can read stack');
    });
  });
});

test('user and stack do not have same role', function(assert) {
  var user, userRole, stack, stackPermission, stackRole;

  Ember.run(function(){
    user     = store.push('user', {id:'u1', roles:['r1'], verified: true});
    userRole = store.push('role', {id:'r1'});

    stack    = store.push('stack', {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {
      id:'p1',
      scope:'read',
      links: {
        role: '/roles/r2'
      }
    });
    stackRole = store.push('role', {id:'r2'});
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      assert.ok(!res, 'user can not manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      assert.ok(!res, 'user can not read stack');
    });
  });
});

test('user has privileged role in stack organization can manage stack', function(assert) {
  let user, userRole, stack, otherRole, stackPermission;
  let links = { organization: '123' };

  Ember.run(function(){
    user     = store.push('user', {id: 'u1', roles: ['r1'], verified: true});
    userRole = store.push('role', {id:'r1', privileged: true, links: links});
    otherRole = store.push('role', {id: 'r2', links: links});

    // stack permission has otherRole, not privileged userRole
    stackPermission = store.push('permission', {
      id:'p1',
      links: {
        roles: '/role/r2'
      }
    });
    stack    = store.push('stack', {id:'s1', permissions:['p1'], links: links});
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      assert.ok(res, 'privileged user with matching role can manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      assert.ok(res, 'privileged user with privileged role in organization can read stack');
    });
  });
});

test('user has privileged role in outside organization cannot manage stack', function(assert) {
  let user, userRole, stack, outsideRole, stackPermission;
  let organization = { organization: '123' };
  let outsideOrganizationUrl = '/organziation/321';

  Ember.run(function(){
    user     = store.push('user', {id: 'u1', roles: ['r1'], verified: true});
    userRole = store.push('role', {id:'r1', privileged: true, links: organization });
    outsideRole = store.push('role', {id: 'r2', links: {organization: outsideOrganizationUrl }});

    stackPermission = store.push('permission', {
      id:'p1', role: 'r2',
      links: {
        organization: outsideOrganizationUrl,
        role: '/roles/r2'
      }
    });
    stack    = store.push('stack', {id:'s1', permissions:['p1']});
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      assert.ok(!res, 'privileged user from outside organization can not manage stack');

      return can(user, 'read', stack);
    });
  });
});

test('user has multiple roles, some match stack\'s role', function(assert) {
  var user,
      userRole1, userRole2,
      stack,
      stackPermission;

  Ember.run(function(){
    user      = store.push('user', {id:'u1', roles:['r1','r2'], verified: true});
    userRole1 = store.push('role', {id:'r1'});
    userRole2 = store.push('role', {id:'r2'});

    stack           = store.push('stack',      {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {
      id:'p1',
      scope:'read',
      links: {
        role: '/roles/r2'
      }
    });
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      assert.ok(!res, 'user can not manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      assert.ok(res, 'user can read stack');
    });
  });
});

test('stack has multiple permissions, some match user\'s role', function(assert) {
  var user,
      userRole,
      stack,
      stackPermission1,
      stackPermission2;

  Ember.run(function(){
    user      = store.push('user', {id:'u1', roles:['r1'], verified: true});
    userRole  = store.push('role', {id:'r1'});

    stack            = store.push('stack',      {id:'s1', permissions:['p1','p2']});
    stackPermission1 = store.push('permission', {
      id:'p1',
      scope:'read',
      links: {
        role: '/roles/r1'
      }
    });
    stackPermission2 = store.push('permission', {
      id:'p2',
      scope:'read',
      links: {
        role: '/roles/r2'
      }
    });
    store.push('role', {id:'r2'});
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      assert.ok(!res, 'user can not manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      assert.ok(res, 'user can read stack');
    });
  });
});

test('with manage permission scope, user can do anything', function(assert) {
  var user,
      userRole,
      stack,
      stackPermission;

  Ember.run(function(){
    user      = store.push('user', {id:'u1', roles:['r1'], verified: true});
    userRole = store.push('role', {id:'r1'});

    stack           = store.push('stack',      {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {
      id:'p1',
      scope:'manage',
      links: {
        role: '/roles/r1'
      }
    });
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      assert.ok(res, 'user can manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      assert.ok(res, 'user can read stack');

      return can(user, 'glorp', stack);
    }).then(function(res){
      assert.ok(res, 'user can glorp stack');
    });
  });
});

test('when permission data includes role links, do not fetch roles, just use derived ids', function(assert) {
  var user,
      userRole,
      stack,
      stackPermission;

  Ember.run(function(){
    user      = store.push('user', {id:'u1', roles:['abc-DEF-123'], verified: true});
    userRole = store.push('role', {id:'abc-DEF-123'});

    stack           = store.push('stack',      {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {
      id:'p1',
      scope:'manage',
      links: {role: '/roles/abc-DEF-123'}
    });
  });

  stubRequest('get', '/roles/abc-DEF-123', function(){
    assert.ok(false, 'should not fetch role by url');
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(){
      assert.ok(true, 'did not fetch role by url');
    });
  });
});

// test('#can fetches data when it is not in the store', function(){
//   expect(5);

//   var user,
//       userRole,
//       stack,
//       stackPermission;

//   stubRequest('get', '/users/u1', function(){
//     ok(true, 'requests user by id');

//     return this.success({
//       id: 'u1',
//       verified: true,
//       _links: {
//         self: { href: '/users/u1' },
//         roles: { href: '/users/u1/roles'}
//       }
//     });
//   });

//   stubRequest('get', '/users/u1/roles', function(){
//     ok(true, 'requests user roles');

//     return this.success({
//       _embedded: {
//         roles: [{
//           id: 'abc-DEF-123',
//         }]
//       }
//     });
//   });

//   stubRequest('get', '/accounts/s1', function(){
//     ok(true, 'requests stacks by id');

//     return this.success({
//       id: 's1',
//       _embedded: {
//         permissions: [{
//           id: 'p1',
//           scope: 'read',
//           _links: {
//             role: { href: '/roles/abc-DEF-123' }
//           }
//         }]
//       }
//     });
//   });

//   stubRequest('get', '/roles/abc-DEF-123', function(){
//     ok(false, 'should not request role by url');
//   });

//   return Ember.run(function(){
//     return Ember.RSVP.hash({
//       user:  store.find('user', 'u1'),
//       stack: store.find('stack', 's1')
//     }).then(function(results){
//       user = results.user;
//       stack = results.stack;

//       return can(user, 'manage', stack);
//     }).then(function(bool){
//       ok(!bool, 'user cannot manage stack');

//       return can(user, 'read', stack);
//     }).then(function(bool){
//       ok(bool, 'user can read stack');
//     });
//   });
// });

test('when user has privileged organization role, user can manage organization', function(assert){
  assert.expect(1);
  let done = assert.async();
  let user, roles = [], organization;
  Ember.run( () => {
    user = store.push('user', {id: 'u1', roles: ['r1', 'r2'], verified: true});
    roles.push( store.push('role', {id:'r1', organization: 'o1', links: {organization:'/organizations/o1'}}) );
    roles.push( store.push('role',
      {
        id:'r2',
        privileged: true,
        organization: 'o1',
        links: {organization: '/organizations/o1'}
      }
    ));

    organization = store.push('organization', {id: 'o1'});
  });

  return Ember.run( () => {
    can(user, 'manage', organization).then( (result) => {
      assert.ok(result, 'user can manage organization');
    }).finally(done);
  });
});

test('when user is not verified, can read', (assert) => {
  var user, userRole, stack, stackPermission;

  Ember.run(function(){
    user     = store.push('user', {id:'u1', roles:['r1'], verified: false});
    userRole = store.push('role', {id:'r1'});

    stack    = store.push('stack', {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {
      id:'p1',
      scope:'manage',
      links: {
        role: '/roles/r1'
      }
    });
  });

  return Ember.run(function(){
    return can(user, 'read', stack).then(function(res){
      assert.ok(res, 'user can read stack');
    });
  });
});

test('when user is not verified, cannot manage', (assert) => {
  var user, userRole, stack, stackPermission;

  Ember.run(function(){
    user     = store.push('user', {id:'u1', roles:['r1'], verified: false});
    userRole = store.push('role', {id:'r1'});

    stack    = store.push('stack', {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {
      id:'p1',
      scope:'manage',
      links: {
        role: '/roles/r1'
      }
    });
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then((res) => {
      assert.ok(!res, 'user cannot manage stack');
    });
  });
});
