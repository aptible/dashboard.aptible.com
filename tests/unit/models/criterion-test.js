import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';

moduleForModel('criterion', 'model:criterion', {
  needs: ['adapter:criterion', 'service:currentOrganization', 'model:document']
});

test('it exists', function(assert) {
  var model = this.subject();
  assert.ok(!!model);
});
