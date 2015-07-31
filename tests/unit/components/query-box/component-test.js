import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from "ember";

var mockAnalytics;

moduleForComponent('query-box', 'QueryBoxComponent', {
  unit: true,

  setup: function() {
    mockAnalytics = Ember.Object.create();
  },
  subject: function() {
    var klass = this.container.lookupFactory(this.subjectName);
    var createOptions = {analytics: mockAnalytics};
    return klass.create(createOptions);
  }
});

test('it renders email input', function(assert) {
  mockAnalytics.set('hasEmail', false);
  var element = this.$();
  assert.ok(element.find('input[type=email]').length === 1, 'has email field');
  assert.ok(element.find('button').length === 1, 'has button');
});

test('when email is know, skips input', function(assert) {
  mockAnalytics.set('hasEmail', true);
  var element = this.$();
  assert.ok(element.find('input[type=email]').length === 0, 'no email field');
  assert.ok(element.find('button').length === 1, 'has button');
});

test('it identifies with email', function(assert) {
  assert.expect(2);
  var done = assert.async();

  var email = 'some@email.com';

  var component = this.subject();

  mockAnalytics.identify = function(_email) {
    assert.equal(_email, email, "email is passed");
    return new Ember.RSVP.Promise(function(resolve){
      setTimeout(resolve, 2);
    });
  };
  mockAnalytics.showChat = function() {
    assert.ok(true, 'shows chat');
    done();
  };

  component.send('submit', email);
});

test('it show chat without identifying', function(assert) {
  assert.expect(1);

  var component = this.subject();

  mockAnalytics.showChat = function() {
    assert.ok(true, 'shows chat');
  };

  component.send('submit');
});
