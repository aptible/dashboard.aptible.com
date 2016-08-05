import Ember from 'ember';
import CriterionStatusMixin from 'diesel/mixins/components/criterion-status';

export default Ember.Component.extend(CriterionStatusMixin, {
  classNames: ['panel', 'panel-default', 'compliance-engine-status', 'resource-list-item'],
  criterion: null,
  criterionDocuments: null,
  title: Ember.computed.reads('criterion.name')
});
