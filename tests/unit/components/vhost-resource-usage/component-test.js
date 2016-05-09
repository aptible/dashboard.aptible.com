import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('vhost-resource-usage', {
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

test('it does render table cells if vhost is provisioned', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject({status: 'provisioned', hourlyRate: 10, handle: 'www.google.com'});

  // renders the component to the page
  this.render();
  let element = component.$();
  equal(element.find('td:first-child').text(), 'www.google.com');
  equal(element.find('td:last-child').text(), '$73.00');
});

test('it does not render table cells if vhost is not provisioned', function(assert) {
  assert.expect(1);

  // creates the component instance
  var component = this.subject({status: 'failed'});

  // renders the component to the page
  this.render();
  equal(component.$().text(), '');
});
