import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('save-progress', 'SaveProgressComponent', {
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  var progress = Ember.Object.create({ totalSteps: 3, currentStep: 0});
  var component = this.subject({ progress: progress });

  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});

test('it updates loading bar', function(assert) {
  var progress = Ember.Object.create({ totalSteps: 4, currentStep: 0});
  var component = this.subject({ progress: progress });

  assert.equal(component.get('showProgressBar'), false, 'Progress bar is hidden when current step is 0');
  assert.equal(component.get('incomplete'), true, 'Progress bar is incomplete when not started');

  progress.set('currentStep', 1);

  assert.equal(component.get('showProgressBar'), true, 'Progress bar is visible when current step is > 0');
  assert.equal(component.get('incomplete'), true, 'Progress bar is incomplete');
  assert.equal(component.get('progressPercent'), 25, 'Progress is 25 percent complete');

  progress.set('currentStep', 4);

  assert.equal(component.get('showProgressBar'), false, 'Progress bar is hidden when all steps complete');
  assert.equal(component.get('incomplete'), false, 'Progress bar is complete');
  assert.equal(component.get('progressPercent'), 100, 'Progress is 100 percent complete');
});
