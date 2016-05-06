import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('disk-resource-usage', {
  unit: true,
  needs: ['helper:format-currency']
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('it does render table cells if disk is present', function(assert) {
  assert.expect(3);

  // creates the component instance
  var component = this.subject({
    handle: 'test',
    hourlyRate: 10,
    service: { processType: 'web' },
    database: { disk: { size: 1 } }
  });

  // renders the component to the page
  this.render();
  let element = component.$();
  equal(element.find('td:first-child').text(), 'test:web');
  equal(element.find('td:nth-child(2)').text(), '1GB');
  equal(element.find('td:last-child').text(), '$73.00');
});

test('it does not render table cells if disk is not present', function(assert) {
  assert.expect(1);

  // creates the component instance
  var component = this.subject({database: {
    disk: {}
  }});

  // renders the component to the page
  this.render();
  equal(component.$().text(), '');
});
