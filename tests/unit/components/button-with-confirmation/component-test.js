import Ember from "ember";
import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('button-with-confirmation', 'ButtonWithConfirmationComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it confirms', function() {
  var component = this.subject({
    enteredValue: 'foo',
    confirmValue: 'foo'
  });

  ok(component.get('isConfirmed'), 'is confirmed');
});

test('it is not confirmed', function() {
  var component = this.subject({
    enteredValue: 'foo',
    confirmValue: 'boo'
  });

  ok(!component.get('isConfirmed'), 'is not confirmed');
});

test('input makes it confirmed', function() {
  var component = this.subject({
    confirmValue: 'boo'
  });

  this.append();

  var input = component.$('input').val('boo');

  ok(input.hasClass('unconfirmed'), 'is not confirmed');

  input.val('boo');
  input.trigger('input');

  ok(input.hasClass('confirmed'), 'is confirmed');

  input.val('foo');
  input.trigger('input');

  ok(input.hasClass('unconfirmed'), 'is not confirmed');
});

test('action is sent when confirmed', function() {
  var actionCalled;
  var component = this.subject({
    enteredValue: 'foo',
    confirmValue: 'foo',
    action: 'save',
    targetObject: {
      save: function(){
        actionCalled = true;
      }
    }
  });

  Ember.run(component, 'send', 'submit');
  ok(actionCalled, 'action is triggered');
});

test('action is not sent when unconfirmed', function() {
  var actionCalled;
  var component = this.subject({
    enteredValue: 'foo',
    confirmValue: 'boo',
    action: 'save',
    targetObject: {
      save: function(){
        actionCalled = true;
      }
    }
  });

  Ember.run(component, 'send', 'submit');
  ok(!actionCalled, 'action not is triggered');
});
