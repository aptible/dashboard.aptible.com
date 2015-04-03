import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('permitted-stacks-by-role');

let permits = function(role, scope) {
  return new Ember.RSVP.Promise((resolve) => { resolve(true); });
};

let rejects = function(role, scope) {
  return new Ember.RSVP.Promise((resolve) => { resolve(false); });
};

test('it renders', function() {
  expect(2);

  var component = this.subject({
    scope: 'manage',
    role: Ember.Object.create({ privileged: true }),
    stacks: [Ember.Object.create({ permitsRole: permits })]
  });

  equal(component._state, 'preRender');

  this.render();
  equal(component._state, 'inDOM');
});

test('returns all stacks that permit role', function() {
  let stack1 = Ember.Object.create({
    handle: 'my-stack-1',
    permitsRole: permits
  });

  let stack2 = Ember.Object.create({
    handle: 'my-stack-2',
    permitsRole: permits
  });

  let stack3 = Ember.Object.create({
    handle: 'my-stack-3',
    permitsRole: rejects
  });

  let component = this.subject({
    scope: 'manage',
    stacks: [stack1, stack2, stack3]
  });

  component.updatePermittedStacks().then(function() {
    equal(component.get('stacksString'), 'my-stack-1, my-stack-2',
        'returns permitted stacks handle');
  });
});
