import {
  moduleFor,
  test
} from 'ember-qunit';
import Ember from "ember";
import { stubRequest } from "../../helpers/fake-server";

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

test('A valid response should add no error messages', function() {
  let validator;
  stop();

  stubRequest('post', claimUrl, function(request) {
    ok(true, 'request was made');
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
      ok(!validator.get('errors.length'), 'has no errors');
      start();
    });
  });
});

test('An error response should add an error message', function() {
  let validator;
  stop();

  stubRequest('post', claimUrl, function(request) {
    ok(true, 'request was made');
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
      ok(validator.get('errors.length') === 1, 'has an error');
      equal(validator.get('errors').objectAt(0), "seat's taken!");
      start();
    });
  });
});
