import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('usage-quote-by-resource', {
  needs: ['helper:format-currency', 'component:stack-resource-usage'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject({
    resource: 'container'
  });
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('if resource equals container then grossUsage should equal sum of service usage', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject({
    resource: 'container',
    services: [{usage: 5},{usage: 5}]
  });

  // renders the component to the page
  this.render();
  assert.equal(10, component.get('grossUsage'));
  assert.equal(component.get('grossUsage'), component.get('totalContainerUsage'));
});

test('if resource equals disk then grossUsage should equal the sum of stack totalDiskSize', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject({
    resource: 'disk',
    stacks: [{ totalDiskSize: 5 },{ totalDiskSize: 5 }]
  });

  // renders the component to the page
  this.render();
  assert.equal(10, component.get('grossUsage'));
  assert.equal(component.get('grossUsage'), component.get('stacks').reduce((prev, curr) => {
    return prev + curr.totalDiskSize;
  }, 0));
});

test('if resource equals domain then grossUsage should equal the sum of stack domainCount', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject({
    resource: 'domain',
    stacks: [{ domainCount: 5 },{ domainCount: 5 }]
  });

  // renders the component to the page
  this.render();
  assert.equal(10, component.get('grossUsage'));
  assert.equal(component.get('grossUsage'), component.get('stacks').reduce((prev, curr) => {
    return prev + curr.domainCount;
  }, 0));
});


