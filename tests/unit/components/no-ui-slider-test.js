import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('no-ui-slider', 'NoUiSliderComponent', {
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('sliding sends action didSlide with the value', function(assert) {
  var slideValue;

  var MockController = Ember.Object.extend(Ember.ActionHandler, {
    _actions: {
      mySlideAction: function(val){
        slideValue = val;
      }
    }
  });

  var mockController = MockController.create();

  this.subject({
    targetObject: mockController,
    start: 1,
    rangeMin: 1,
    rangeMax: 5,
    step: 1,

    didSlide: 'mySlideAction'
  });

  var element = this.$();

  Ember.$(element).trigger('slide', 4);

  assert.equal(slideValue, 4, 'slide action called with value');
});
