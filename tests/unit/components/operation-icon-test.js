import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('operation-icon', 'OperationIconComponent', {
  unit: true,

  needs: ['component:bs-tooltip']
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject({
    type: 'provision',
    status: 'queued'
  });

  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
