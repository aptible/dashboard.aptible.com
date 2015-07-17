import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('stack', 'model:stack', {
  // Specify the other units that are required for this test.
  needs: modelDeps
});

test('findAll works', function(assert) {
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
      assert.equal(stacks.get('length'),2,'finds 2 stacks');
      assert.equal(stacks.get('firstObject.name'), 'first stack');
      assert.equal(stacks.get('lastObject.name'), 'second stack');
      assert.equal(stacks.get('firstObject.type'), 'development');
      assert.equal(stacks.get('lastObject.type'), 'production');
    });
  });
});
