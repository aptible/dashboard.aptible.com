import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('permitted-stacks-by-role', {
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject({
    scope: 'manage',
    role: Ember.Object.create({ id: 'r1', type: 'owner' }),
    stacks: [Ember.Object.create({
      permissions: [{
        id: 'permission-1',
        scope: 'manage',
        _links: { role: { href: '/roles/r1' } }
      }]
    })]
  });

  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});

test('returns all stacks that permit role', function(assert) {
  let stack1 = Ember.Object.create({
    handle: 'my-stack-1',
    permissions: [
      id: 'stack-1-permission-1',
      scope: 'manage',
      _links: { role: { href: '/roles/r1' } }
    ]
  });

  let stack2 = Ember.Object.create({
    handle: 'my-stack-2',
    permissions: [
      id: 'stack-2-permission-1',
      scope: 'manage',
      _links: { role: { href: '/roles/r1' } }
    ]
  });

  let stack3 = Ember.Object.create({
    handle: 'my-stack-3',
    permissions: []
  });

  let component = this.subject({
    scope: 'manage',
    stacks: [stack1, stack2, stack3]
  });

  component.updatePermittedStacks().then(function() {
    assert.equal(component.get('stacksString'), 'my-stack-1, my-stack-2',
        'returns permitted stacks handle');
  });
});
