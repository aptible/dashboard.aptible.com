import Ember from 'ember';
import config from '../../config/environment';
import { STEPS, getStepIndex } from 'diesel/components/spd-nav/component';

export default Ember.Component.extend({
  routingService: Ember.inject.service('routing'),

  multipleOrganizations: Ember.computed.gt('organizations.length', 1),

  complianceEngines: Ember.computed(function() {
    return config.complianceEngines;
  }),

  complianceTools: Ember.computed(function() {
    return config.complianceTools;
  }),

  currentStepIndex: Ember.computed('routingService.currentPath', function() {
    return getStepIndex(this.get('routingService.currentPath'));
  }),

  isOnAStep: Ember.computed.gte('currentStepIndex', 0),

  steps: Ember.computed('routingService.currentPath', function() {
    let currentStepIndex = this.get('currentStepIndex');
    let steps = STEPS.slice(0, -1); // Remove the finish step

    steps.map((step, stepIndex) => {
      Ember.setProperties(step, {
        current: (stepIndex === currentStepIndex),
        path:`compliance-settings.${step.key}`
      });

      return step;
    });

    return steps;
  }),
});
