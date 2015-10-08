import Ember from 'ember';
export const STEPS = [
  { key: 'organization',      name: 'Organization Settings' },
  { key: 'locations',         name: 'Locations' },
  { key: 'team',              name: 'Team' },
  { key: 'data-environments', name: 'Data Environments' },
  { key: 'security-controls', name: 'Security Controls' },
  { key: 'finish',            name: 'Finish' }
];
export const STEP_PREFIX = 'organization.setup';

function getStepIndex(currentPath) {
  let i;

  STEPS.forEach((step, index) => {
    if(`${STEP_PREFIX}.${step.key}` === currentPath) {
      i = index;
    }
  });

  return i;
}

export default Ember.Component.extend({
  tagName: '',
  routingService: Ember.inject.service('routing'),

  currentStepIndex: Ember.computed('routingService.currentPath', function() {
    return getStepIndex(this.get('routingService.currentPath'));
  }),

  isOnAStep: Ember.computed.gte('currentStepIndex', 0),

  steps: Ember.computed('routingService.currentPath', function() {
    let currentStepIndex = this.get('currentStepIndex');
    let steps = STEPS;

    steps.map((step, stepIndex) => {
      Ember.setProperties(step, {
        current: (stepIndex === currentStepIndex),
        completed: (stepIndex < currentStepIndex),
        path:`setup.${step.key}`
      });

      return step;
    });

    return steps;
  }),

  next: Ember.computed('currentStepIndex', 'steps', function() {
    let index = this.get('currentStepIndex');

    if(index === (this.get('steps.length') - 1)) {
      return false;
    }

    return this.get('steps')[index + 1];
  }),

  previous: Ember.computed('currentStepIndex', 'steps', function() {
    let index = this.get('currentStepIndex');

    if(index === 0) {
      return false;
    }

    return this.get('steps')[index - 1];
  })
});
