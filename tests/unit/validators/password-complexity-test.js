import {
  moduleFor,
  test
} from 'ember-qunit';
import Ember from "ember";

var model;

moduleFor('validator:password-complexity', 'PasswordComplexityValidator', {
  setup: function(){
    model = Ember.Object.create({
      dependentValidationKeys: {}
    });
  },
  subject: function(options, klass){
    options = options || {};
    Ember.merge(options, {
      model: model
    });
    return klass.create(options);
  }
});

test('finds invalid password', function(assert) {
  model.set('password', 'foo');
  let validator = this.subject({
    property: 'password'
  });

  assert.deepEqual(validator.get('errors'), [
   "must be at least 10 characters",
   "must contain at least one uppercase letter",
   "must contain at least one digit or special character"
  ], 'bad passwords have errors');
});
