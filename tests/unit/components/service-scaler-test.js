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

test('it should set shouldDisable to true for v1 stacks', function(assert) {
  assert.expect(1);

  // creates the component instance
  var component = this.subject({
    service: Ember.Object.create({
      containerSize: 1024,
      containerCount: 1,
      stack: Ember.Object.create({})
    })
  });

  assert.equal(true, component.get('shouldDisable'));
});

test('it should set shouldDisable to false for v2 stacks', function(assert) {
  assert.expect(1);

  // creates the component instance
  var component = this.subject({
    service: Ember.Object.create({
      containerSize: 1024,
      containerCount: 1,
      stack: Ember.Object.create({
        sweetnessStackVersion: 'v2'
      })
    })
  });

  assert.equal(false, component.get('shouldDisable'));
});

test('it should set shouldDisable to true when component is saving', function(assert) {
  assert.expect(1);

  // creates the component instance
  var component = this.subject({
    isSaving: true,
    service: Ember.Object.create({
      containerSize: 1024,
      containerCount: 1,
      stack: Ember.Object.create({
        sweetnessStackVersion: 'v2'
      })
    })
  });

  assert.equal(true, component.get('shouldDisable'));
});

test('it should show a success message when it succeeds', function(assert) {
  const scaleServiceAction = function(_0, _1, _2, deferred) {
    return deferred.resolve();
  };

  this.subject({
    service: Ember.Object.create({
      containerSize: 1024,
      containerCount: 1,
      stack: Ember.Object.create({
        sweetnessStackVersion: 'v2'
      })
    }),
    containerCount: 2,
    targetObject: { scaleServiceAction },
    scaleService: "scaleServiceAction"
  });

  this.render();

  Ember.run(() => {
    this.$().find("button").click();
  });

  assert.ok(!this.$().find("div:contains(Some error)").length, "Has no error");
  assert.ok(this.$().find("div:contains(scaled to)").length, "Has success");
});

test('it should not show a success message when it fails', function(assert) {
  const scaleServiceAction = function(_0, _1, _2, deferred) {
    return deferred.reject(new Error("Some error"));
  };

  this.subject({
    service: Ember.Object.create({
      containerSize: 1024,
      containerCount: 1,
      stack: Ember.Object.create({
        sweetnessStackVersion: 'v2'
      })
    }),
    containerCount: 2,
    targetObject: { scaleServiceAction },
    scaleService: "scaleServiceAction"
  });

  this.render();

  Ember.run(() => {
    this.$().find("button").click();
  });

  assert.ok(this.$().find("div:contains(Some error)").length, "Has error");
  assert.ok(!this.$().find("div:contains(scaled to)").length, "Has no success");
});
