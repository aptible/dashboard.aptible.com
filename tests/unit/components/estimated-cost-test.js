import {
  moduleForComponent,
  test
} from 'ember-qunit';

function mockFeaturesService(isEnabled) {
  return {
    isEnabled: function(feature) {
      return isEnabled && feature === 'price-estimator';
    }
  };
}

import Ember from 'ember';

moduleForComponent('estimated-cost', 'EstimatedCostComponent', {
  unit: true,

  subject: function(opts = {}) {
    var klass = this.container.lookupFactory(this.subjectName);
    return klass.create({
      features: opts.features || mockFeaturesService(true),
      count: 5,
      stack: Ember.Object.create({
        appContainerCentsPerHour: 10,
        type: 'production'
      })
    });
  }
});

test('it renders', function() {
  expect(2);

  var component = this.subject();

  equal(component._state, 'preRender');

  this.render();
  equal(component._state, 'inDOM');
});

test('calculates accurate estimate', function() {
  expect(3);
  var component = this.subject();

  equal(component.get('rateInDollars'), '$0.10');
  equal(component.get('unitOfMeasure'), 'Production App Containers');
  equal(component.get('total'), '$365.50');
});

test('is visible with priceEstimator feature flag', function() {
  var component = this.subject();
  this.render();

  ok(component.get('isVisible'), 'it is visible');
});

test('is not visible with priceEstimator feature flag disabled', function() {
  var component = this.subject({ features: mockFeaturesService(false) });

  this.render();

  ok(!component.get('isVisible'), 'it is not visible');
});
