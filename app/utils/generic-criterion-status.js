import Ember from 'ember';
import CriterionStatusMixin from 'diesel/mixins/services/criterion-status';

export default Ember.Object.extend(CriterionStatusMixin, {
  showDefaultStatus: true
});