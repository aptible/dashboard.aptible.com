import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from "ember";

var mockAnalytics;

moduleForComponent('query-box', 'QueryBoxComponent', {
  setup: function() {
    mockAnalytics = Ember.Object.create();
  },
  subject: function() {
    var container = this.container;
    var klass = this.container.lookupFactory(this.subjectName);
    var createOptions = {analytics: mockAnalytics};
    return klass.create(createOptions);
  }
});

test('it renders email input', function() {
  mockAnalytics.set('hasEmail', false);
  var element = this.render();
  ok(element.find('input[type=email]').length === 1, 'has email field');
  ok(element.find('button').length === 1, 'has button');
});

test('when email is know, skips input', function() {
  mockAnalytics.set('hasEmail', true);
  var element = this.render();
  ok(element.find('input[type=email]').length === 0, 'no email field');
  ok(element.find('button').length === 1, 'has button');
});

test('it identifies with email', function() {
  expect(2);
  stop();

  var email = 'some@email.com';

  var component = this.subject();

  mockAnalytics.identify = function(_email, fn) {
    equal(_email, email, "email is passed");
    return new Ember.RSVP.Promise(function(resolve){
      setTimeout(resolve, 2);
    });
  };
  mockAnalytics.showChat = function() {
    ok(true, 'shows chat');
    start();
  };

  component.send('submit', email);
});

test('it show chat without identifying', function() {
  expect(1);

  var component = this.subject();

  mockAnalytics.showChat = function() {
    ok(true, 'shows chat');
  };

  component.send('submit');
});
