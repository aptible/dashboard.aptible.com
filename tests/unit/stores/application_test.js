import {
  moduleFor,
  test
} from 'ember-qunit';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';
import Ember from "ember";

moduleFor('store:application', {
  needs: modelDeps.concat([
    'store:application', 'adapter:application',
    'adapter:organization', 'serializer:application'
  ])
});

test('#findStacksBy', function(assert) {
  var service = this.subject();

  Ember.run(() => {
    service.push('organization', {
      id: '111',
      name: 'my-org',
      links: {
        self: 'http://example.com/my-org'
      }
    });
  });

  var organization = service.getById('organization', '111');

  stubRequest('get', `/accounts`, function(request){
    assert.ok(true, 'posts to correct url');
    return this.success({
      _embedded: {
        accounts: [{
          id: 'valid',
          handle: 'valid',
          _links: {
            organization: { href: 'http://example.com/my-org' }
          }
        },{
          id: 'invalid',
          handle: 'invalid',
          _links: {
            organization: { href: 'http://example.com/other-org' }
          }
        }]
      }
    });
  });

  Ember.run(() => {
    service.findStacksFor(organization).then(function(stacks){
      assert.ok(true, 'completed query');
      assert.equal(stacks.get('length'), 1, 'has a single stack');
      assert.equal(stacks.get('firstObject.handle'), 'valid',
        'valid stack is returned for organization');
    });
  });
});
