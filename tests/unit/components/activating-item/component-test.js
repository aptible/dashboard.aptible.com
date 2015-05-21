import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('activating-item', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it is active when matching', function(assert) {
  assert.expect(5);

  let mockRoutingService = {
    currentPath: 'abc'
  };

  // creates the component instance
  var component = this.subject({
    routingService: mockRoutingService
  });
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');

  assert.ok(!component.get('active'), 'not active by default');

  Ember.run(component, 'set', 'currentWhen', 'abc');

  assert.ok(component.get('active'),
            'active when currentWhen path matches app path');

  Ember.run(component, 'set', 'currentWhen', 'ab');

  assert.ok(component.get('active'),
            'active when app path is subset of currentWhen path');
});

test('it is active when matching with dashboard prefix', function(assert) {
  assert.expect(5);

  let mockRoutingService = {
    currentPath: 'dashboard.abc'
  };

  // creates the component instance
  var component = this.subject({
    routingService: mockRoutingService
  });
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');

  assert.ok(!component.get('active'), 'not active by default');

  Ember.run(component, 'set', 'currentWhen', 'abc');

  assert.ok(component.get('active'),
            'active when currentWhen path matches app path');

  Ember.run(component, 'set', 'currentWhen', 'ab');

  assert.ok(component.get('active'),
            'active when app path is subset of currentWhen path');
});
