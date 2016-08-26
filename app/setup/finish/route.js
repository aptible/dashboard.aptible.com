import Ember from 'ember';
import SPDRouteMixin from 'diesel/mixins/routes/spd-route';

export const NEXT_STEPS = [
  { key: 'risk-assessments', title: 'Complete a Risk Analysis', cta: 'Begin Risk Analysis', current: true, step: 2 },
  { key: 'gridiron-admin.policy', title: 'Create your Policies & Procedures', cta: 'Begin Policies & Procedures', step: 3 },
  { key: 'gridiron-admin.security', title: 'Complete your Application Security Assessments', cta: 'Begin Assessments', step: 4 },
  { key: 'gridiron-admin.contracts', title: 'Upload your Business Associate Agreements', cta: 'Upload BAAs', step: 5 }
];

export default Ember.Route.extend(SPDRouteMixin, {
  model() {
    return { steps: NEXT_STEPS,
             organization: this.modelFor('gridiron-organization') };
  }
});
