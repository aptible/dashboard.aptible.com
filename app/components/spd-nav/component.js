import Ember from 'ember';
export const STEPS = [
  { key: 'organization',      name: 'Organization' },
  { key: 'locations',         name: 'Locations' },
  { key: 'team',              name: 'Workforce' },
  { key: 'data-environments', name: 'Data Environments' },
  { key: 'security-controls', name: 'Security Controls' },
  { key: 'finish',            name: 'Finish' }
];


export function getStepIndex(currentPath) {
  let prefix = /^organization/ig;
  let i;

  if (!currentPath) {
    Ember.warn("`getStepIndex` called without a valid path");
    return null;
  }

  // Remove initial segment to prevent hits on organization SPD step erroneously
  currentPath = currentPath.replace(prefix, '');

  STEPS.forEach((step, index) => {
    if(currentPath.indexOf(step.key) >= 0) {
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
  showSave: Ember.computed('onSave', function() {
    return !!this.get('onSave');
  }),

  showPrevious: Ember.computed('onPrevious', function() {
    return !!this.get('onPrevious');
  }),

  isSaving: Ember.computed('attestation.isSaving', 'profile.isSaving', function() {
    return this.get('attestation.isSaving') || this.get('profile.isSaving');
  }),

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
  }),

  actions: {
    save() {
      this.sendAction('onSave');
    },

    next(nextPath) {
      this.sendAction('onNext', nextPath);
    },

    previous(previousPath) {
      this.sendAction('onPrevious', previousPath);
    },

    finish() {
      this.sendAction('onFinish');
    }
  }
});
