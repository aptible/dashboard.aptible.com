import Ember from 'ember';

export const NEXT_STEPS = [
  { key: 'risk', title: 'Complete a Risk Analysis', cta: 'Begin Risk Analysis', current: true, step: 2 },
  { key: 'policy', title: 'Create your Policies & Procedures', cta: 'Begin Policies & Procedures', step: 3 },
  { key: 'security', title: 'Complete your Application Security Assessments', cta: 'Begin Assessments', step: 4 },
  { key: 'contracts', title: 'Upload your Business Associate Agreements', cta: 'Upload BAAs', step: 5 }
];

export default Ember.Route.extend({
  model() {
    return NEXT_STEPS;
  }
});
