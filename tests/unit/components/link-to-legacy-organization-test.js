import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('link-to-legacy-organization', 'LinkToLegacyOrganizationComponent', {
  needs: ['component:link-to-aptible',]
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    organization: Ember.Object.create({ id: '1' })
  });

  equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  equal(component._state, 'inDOM');
});

test('calculates accurate estimate', function() {
  expect(1);

  var component = this.subject({
    organization: Ember.Object.create({ id: '1' })
  });

  equal(component.get('path'), 'organizations/1');
});
