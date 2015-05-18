import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from "ember";

let MockService = Ember.Object.extend(Ember.Evented);
let confirmationModalService;

moduleForComponent('confirmation-modal', {
  subject(options, klass) {
    options = options || {};
    options.confirmationModalService = confirmationModalService = MockService.create();
    return klass.create(options);
  }
});

test('it can open', function(assert) {
  assert.expect(2);

  var component = this.subject();
  assert.ok(!component.get('isOpen'), 'is not open');

  confirmationModalService.trigger('open', {});
  assert.ok(component.get('isOpen'), 'is open');
});

test('it can have a model', function(assert) {
  assert.expect(2);

  var component = this.subject();
  assert.ok(!component.get('model'), 'has no model');

  confirmationModalService.trigger('open', {model: {isModel: true}});
  assert.ok(component.get('model').isModel, 'has a model');
});

test('can be cancelled', function(assert) {
  assert.expect(3);

  var component = this.subject();
  confirmationModalService.trigger('open', {
    model: {isModel: true},
    onCancel(){
      assert.ok(true, 'fires callback on cancel');
    }
  });

  Ember.run(component, 'send', 'cancel');
  assert.equal(component.get('model'), null, 'unsets model');
  assert.equal(component.get('isOpen'), false, 'closes');
});

test('can be cancelled with promise', function(assert) {
  assert.expect(4);

  let resolve;
  var component = this.subject();
  confirmationModalService.trigger('open', {
    model: {isModel: true},
    onCancel(){
      assert.ok(true, 'fires callback on cancel');
      return new Ember.RSVP.Promise(r => resolve = r);
    }
  });

  Ember.run(component, 'send', 'cancel');
  assert.equal(component.get('isOpen'), true, 'stays open');
  Ember.run(null, resolve);
  assert.equal(component.get('model'), null, 'unsets model');
  assert.equal(component.get('isOpen'), false, 'closes');
});

test('can be confirmed', function(assert) {
  assert.expect(3);

  var component = this.subject();
  confirmationModalService.trigger('open', {
    model: {isModel: true},
    onConfirm(){
      assert.ok(true, 'fires callback on confirm');
    }
  });

  Ember.run(component, 'send', 'confirm');
  assert.equal(component.get('model'), null, 'unsets model');
  assert.equal(component.get('isOpen'), false, 'closes');
});

test('can be confirmed with promise', function(assert) {
  assert.expect(4);

  let resolve;
  var component = this.subject();
  confirmationModalService.trigger('open', {
    model: {isModel: true},
    onConfirm(){
      assert.ok(true, 'fires callback on confirm');
      return new Ember.RSVP.Promise(r => resolve = r);
    }
  });

  Ember.run(component, 'send', 'confirm');
  assert.equal(component.get('isOpen'), true, 'stays open');
  Ember.run(null, resolve);
  assert.equal(component.get('model'), null, 'unsets model');
  assert.equal(component.get('isOpen'), false, 'closes');
});
