import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';

moduleForModel('document', 'model:document', {
  needs: ['model:criterion', 'adapter:criterion', 'adapter:document',
          'transform:iso-8601-timestamp']
});

test('it exists', function(assert) {
  var model = this.subject();
  assert.ok(!!model);
});

test('creating POSTs to correct url', function(assert) {
  expect(2);

  var store = this.store();
  var doc, criterion;

  Ember.run(function(){
    criterion = store.createRecord('criterion', {id: '1'});
    doc = store.createRecord('document', { criterion:criterion });
  });

  stubRequest('post', '/criteria/1/documents', function(){
    assert.ok(true, 'calls with correct URL');

    return this.success(201, {
      id: 'my-document-id'
    });
  });

  return Ember.run(function(){
    return doc.save().then(function(){
      assert.ok(true, 'document did save');
    });
  });
});

test('`isExpired` returns true after `expiresAt`', function(assert) {
  let expiredDate = new Date();
  expiredDate.setYear(expiredDate.getFullYear() - 2);

  var model = this.subject();
  Ember.run(() => {
    model.setProperties({ createdAt: new Date(), expiresAt: expiredDate });

    assert.equal(model.get('isExpired'), true,
                '`isExpired` returns true for passed expiresAt date');
  });
});

test('`isExpired` returns false when before `expiresAt`', function(assert) {
  let expiredDate = new Date();
  expiredDate.setYear(expiredDate.getFullYear() + 2);

  let model = this.subject();
  Ember.run(() => {
    model.setProperties({ createdAt: new Date(), expiresAt: expiredDate });

    assert.equal(model.get('isExpired'), false,
                '`isExpired` returns false before expiresAt date');
  });
});