import Ember from 'ember';
import CriterionStatusMixin from 'diesel/mixins/components/criterion-status';

export default Ember.Component.extend(CriterionStatusMixin, {
  classNames: ['criterion-status-badge'],
  criterion: null,
  criterionDocuments: null,
  badgeText: Ember.computed('status', function() {
    return {
      incomplete: 'Incomplete',
      expired: 'Expired',
      complete: 'Complete'
    }[this.get('status')];
  })
});
