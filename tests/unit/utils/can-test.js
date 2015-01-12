import {
  moduleForModel,
  test
} from 'ember-qunit';
import config from "../../../config/environment";
import { stubRequest } from '../../helpers/fake-server';
import DS from "ember-data";
import Ember from "ember";
import can from "../../../utils/can";

var store;

moduleForModel('user', 'Utils - #can', {
  needs: [
    'model:role',
    'model:token',
    'model:app',
    'model:database',
    'model:service',
    'model:operation',
    'model:stack',
    'model:permission',
    'adapter:application',
    'serializer:application'
  ],
  setup: function(container){
    store = container.lookup('store:main');
  },
  teardown: function(){
    Ember.run(store, 'destroy');
  }
});

test('it exists', function(){
  ok(!!can, 'it exists');
});

test('user and stack have same role, stack\'s permission has "manage" scope', function(){
  var user, userRole, stack, stackPermission;

  Ember.run(function(){
    user     = store.push('user', {id:'u1', roles:['r1']});
    userRole = store.push('role', {id:'r1'});

    stack    = store.push('stack', {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {id:'p1', scope:'manage', role:'r1'});
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      ok(res, 'user can manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      ok(res, 'user can read stack');
    });
  });
});

test('user and stack have same role, stack\'s permission has "read" scope', function(){
  var user, userRole, stack, stackPermission;

  Ember.run(function(){
    user     = store.push('user', {id:'u1', roles:['r1']});
    userRole = store.push('role', {id:'r1'});

    stack    = store.push('stack', {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {id:'p1', scope:'read', role:'r1'});
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      ok(!res, 'user can not manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      ok(res, 'user can read stack');
    });
  });
});

test('user and stack do not have same role', function(){
  var user, userRole, stack, stackPermission, stackRole;

  Ember.run(function(){
    user     = store.push('user', {id:'u1', roles:['r1']});
    userRole = store.push('role', {id:'r1'});

    stack    = store.push('stack', {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {id:'p1', scope:'read', role:'r2'});
    stackRole = store.push('role', {id:'r2'});
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      ok(!res, 'user can not manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      ok(!res, 'user can not read stack');
    });
  });
});

test('user has privileged role', function(){
  var user, userRole, stack;

  Ember.run(function(){
    user     = store.push('user', {id:'u1', roles:['r1']});
    userRole = store.push('role', {id:'r1', privileged:true});

    stack    = store.push('stack', {id:'s1', permissions:['p1']});
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      ok(res, 'privileged user can manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      ok(res, 'privileged user can read stack');
    });
  });
});

test('user has multiple roles, some match stack\'s role', function(){
  var user,
      userRole1, userRole2,
      stack,
      stackPermission;

  Ember.run(function(){
    user      = store.push('user', {id:'u1', roles:['r1','r2']});
    userRole1 = store.push('role', {id:'r1'});
    userRole2 = store.push('role', {id:'r2'});

    stack           = store.push('stack',      {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {id:'p1', scope:'read', role: 'r2'});
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      ok(!res, 'user can not manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      ok(res, 'user can read stack');
    });
  });
});

test('stack has multiple permissions, some match user\'s role', function(){
  var user,
      userRole,
      stack,
      stackPermission1,
      stackPermission2;

  Ember.run(function(){
    user      = store.push('user', {id:'u1', roles:['r1']});
    userRole  = store.push('role', {id:'r1'});

    stack            = store.push('stack',      {id:'s1', permissions:['p1','p2']});
    stackPermission1 = store.push('permission', {id:'p1', scope:'read', role: 'r1'});
    stackPermission2 = store.push('permission', {id:'p2', scope:'read', role: 'r2'});
    var otherRole    = store.push('role', {id:'r2'});
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      ok(!res, 'user can not manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      ok(res, 'user can read stack');
    });
  });
});

test('with manage permission scope, user can do anything', function(){
  var user,
      userRole,
      stack,
      stackPermission;

  Ember.run(function(){
    user      = store.push('user', {id:'u1', roles:['r1']});
    userRole = store.push('role', {id:'r1'});

    stack           = store.push('stack',      {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {id:'p1', scope:'manage', role: 'r1'});
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(res){
      ok(res, 'user can manage stack');

      return can(user, 'read', stack);
    }).then(function(res){
      ok(res, 'user can read stack');

      return can(user, 'glorp', stack);
    }).then(function(res){
      ok(res, 'user can glorp stack');
    });
  });
});

test('when permission data includes role links, do not fetch roles, just use derived ids', function(){
  var user,
      userRole,
      stack,
      stackPermission;

  Ember.run(function(){
    user      = store.push('user', {id:'u1', roles:['abc-DEF-123']});
    userRole = store.push('role', {id:'abc-DEF-123'});

    stack           = store.push('stack',      {id:'s1', permissions:['p1']});
    stackPermission = store.push('permission', {id:'p1', scope:'manage', links: {role: '/roles/abc-DEF-123'}});
  });

  stubRequest('get', '/roles/abc-DEF-123', function(){
    ok(false, 'should not fetch role by url');
  });

  return Ember.run(function(){
    return can(user, 'manage', stack).then(function(){
      ok(true, 'did not fetch role by url');
    });
  });
});

test('#can fetches data when it is not in the store', function(){
  expect(5);

  var user,
      userRole,
      stack,
      stackPermission;

  stubRequest('get', '/users/u1', function(){
    ok(true, 'requests user by id');

    return this.success({
      id: 'u1',
      _links: {
        self: { href: '/users/u1' },
        roles: { href: '/users/u1/roles'}
      }
    });
  });

  stubRequest('get', '/users/u1/roles', function(){
    ok(true, 'requests user roles');

    return this.success({
      _embedded: {
        roles: [{
          id: 'abc-DEF-123',
        }]
      }
    });
  });

  stubRequest('get', '/accounts/s1', function(){
    ok(true, 'requests stacks by id');

    return this.success({
      id: 's1',
      _embedded: {
        permissions: [{
          id: 'p1',
          scope: 'read',
          _links: {
            role: { href: '/roles/abc-DEF-123' }
          }
        }]
      }
    });
  });

  stubRequest('get', '/roles/abc-DEF-123', function(){
    ok(false, 'should not request role by url');
  });

  return Ember.run(function(){
    return Ember.RSVP.hash({
      user:  store.find('user', 'u1'),
      stack: store.find('stack', 's1')
    }).then(function(results){
      user = results.user;
      stack = results.stack;

      return can(user, 'manage', stack);
    }).then(function(bool){
      ok(!bool, 'user cannot manage stack');

      return can(user, 'read', stack);
    }).then(function(bool){
      ok(bool, 'user can read stack');
    });
  });
});
