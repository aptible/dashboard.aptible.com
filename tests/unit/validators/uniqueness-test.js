import {
  moduleFor,
  test
} from 'ember-qunit';
import Ember from "ember";
import { stubRequest } from 'ember-cli-fake-server';

let model;
let claimUrl = '/claims/organization';

moduleFor('validator:uniqueness', 'UniquenessValidator', {
  setup() {
    model = Ember.Object.create({
      dependentValidationKeys: {},
      handle: 'handle'
    });
  }
});

test('A valid response should add no error messages', function(assert) {
  let validator;
  let done = assert.async();

  stubRequest('post', claimUrl, function() {
    assert.ok(true, 'request was made');
    return [204, {}, ''];
  });

  Ember.run(() => {
    validator = this.subject({
      model: model,
      property: 'handle',
      options: {
        url: claimUrl
      }
    });

    validator.validate().then(() => {
      assert.ok(!validator.get('errors.length'), 'has no errors');
      done();
    });
  });
});

test('An error response should add an error message', function(assert) {
  let validator;
  let done = assert.async();

  stubRequest('post', claimUrl, function() {
    assert.ok(true, 'request was made');
    return [400, {}, ''];
  });

  Ember.run(() => {
    validator = this.subject({
      model: model,
      property: 'handle',
      options: {
        url: claimUrl,
        message: "seat's taken!"
      }
    });

    validator.validate().finally(() => {
      assert.ok(validator.get('errors.length') === 1, 'has an error');
      assert.equal(validator.get('errors').objectAt(0), "seat's taken!");
      done();
    });
  });
});
