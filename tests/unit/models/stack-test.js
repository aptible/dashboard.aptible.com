import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from "../../helpers/fake-server";
import Ember from 'ember';

moduleForModel('stack', 'Stack', {
  // Specify the other units that are required for this test.
  needs: [
    'model:database',
    'model:app',
    'model:service',
    'model:operation',
    'model:permission',
    'model:role',

    'adapter:application',
    'serializer:application'
  ]
});

test('findAll works', function(){
  var store = this.store();

  stubRequest('get', '/accounts', function(request){
    return this.success({
      _links: {
        self: { href: '/accounts' },
      },
      _embedded: {
        accounts: [{
          id: '2',
          name: 'first stack',
          handle: 'first-stack',
          type: 'development',
          _links: {
            self: { href: '/accounts/2'},
            apps: { href: '/accounts/2/apps' },
            databases: { href: '/accounts/2/databases' }
          }
        }, {
          id: '3',
          name: 'second stack',
          handle: 'second-stack',
          type: 'production',
          _links: {
            self: { href: '/accounts/3'},
            apps: { href: '/accounts/3/apps' },
            databases: { href: '/accounts/3/databases' }
          }
        }]
      }
    });
  });

  return Ember.run(function(){
    return store.find('stack').then(function(stacks){
      equal(stacks.get('length'),2,'finds 2 stacks');
      equal(stacks.get('firstObject.name'), 'first stack');
      equal(stacks.get('lastObject.name'), 'second stack');
      equal(stacks.get('firstObject.type'), 'development');
      equal(stacks.get('lastObject.type'), 'production');
    });
  });
});
