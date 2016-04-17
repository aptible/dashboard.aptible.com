import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

let featuresMock;

function buildFeaturesMock() {
  return Ember.Object.extend({
    isEnabled: function() {}
  });
}

moduleForComponent('service-scaler', 'ServiceScalerComponent', {
  unit: true,
  needs: ['component:no-ui-slider', 'component:estimated-cost'],
  setup: function() {
    this.container.register('service:features-mock', buildFeaturesMock());
    this.container.injection('component', 'features', 'service:features-mock');
    featuresMock = this.container.lookup('service:features-mock');
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject({
    service: Ember.Object.create({
      containerSize: 1024,
      containerCount: 1
    })
  });
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
