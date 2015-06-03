import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('compliance-icon', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject();
  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});


test('shows green check with green status', function() {
  let component = this.subject({ status: { green: true }});
  ok(component.get('isGreen'), 'is green is true');
  ok(!component.get('isRed'), 'is red is false');
});