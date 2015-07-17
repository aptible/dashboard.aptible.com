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

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject();

  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});

test('calculates accurate estimate', function(assert) {
  assert.expect(3);
  var component = this.subject();

  assert.equal(component.get('rateInDollars'), '$0.10');
  assert.equal(component.get('unitOfMeasure'), 'Production App Containers');
  assert.equal(component.get('total'), '$365.50');
});

test('is visible with priceEstimator feature flag', function(assert) {
  var component = this.subject();
  this.render();

  assert.ok(component.get('isVisible'), 'it is visible');
});

test('is not visible with priceEstimator feature flag disabled', function(assert) {
  var component = this.subject({ features: mockFeaturesService(false) });

  this.render();

  assert.ok(!component.get('isVisible'), 'it is not visible');
});
