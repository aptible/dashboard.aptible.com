import Ember from 'ember';
import CriterionStatusMixin from 'diesel/mixins/components/criterion-status';

export default Ember.Component.extend(CriterionStatusMixin, {
  criterion: null,
  criterionDocuments: null
});
