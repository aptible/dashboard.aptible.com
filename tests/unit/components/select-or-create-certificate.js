import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('select-or-create-certificate', {
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject({ certificates: [], vhost: {} });

  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});
