import Ember from 'ember';
import CriterionStatusMixin from 'diesel/mixins/services/criterion-status';

export default Ember.Component.extend(CriterionStatusMixin, {
  criterion: null,
  criterionDocuments: null
});
