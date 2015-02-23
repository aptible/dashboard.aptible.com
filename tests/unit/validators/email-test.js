import {
  moduleFor,
  test
} from 'ember-qunit';
import Ember from "ember";

var model;

moduleFor('validator:email', 'EmailValidator', {
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

test('finds invalid emails', function() {
  model.set('email', 'foo');
  let validator = this.subject({
    property: 'email'
  });

  equal(validator.get('errors.length'), 1, 'foo is not a valid email');
});

test('finds valid emails', function() {
  model.set('email', 'foo');
  let validator = this.subject({
    property: 'email'
  });

  ok(validator.get('errors.length'), 0, 'foo@baz.com is a valid email');
});
