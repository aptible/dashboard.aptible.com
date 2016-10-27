import Ember from 'ember';
import filterComponents from 'diesel/utils/filter-risk-components';
import ColumnConfigMixin from 'diesel/mixins/components/column-config';

const COLUMN_PRESETS = {
  'title': 'Threat Event',
  'description': 'Description',
  'riskLevel': 'Risk Level',
  'relevance': 'Relevance',
  'impact': 'Impact',
  'overallLikelihood': 'Likelihood'
};

export default Ember.Component.extend(ColumnConfigMixin, {
  tagName: 'table',
  classNames: ['base-table'],

  columns: ['title', 'description', 'riskLevel', 'relevance', 'overallLikelihood', 'impact'],
  columnPresets: COLUMN_PRESETS,

  filteredThreatEvents: Ember.computed('filters.riskLevel', 'filters.relevance', 'filters.sort', 'filters.impact', 'filters.search', 'threatEvents.[]', function() {
    let threatEvents = this.get('threatEvents');
    let filters = this.get('filters');

    return filterComponents(threatEvents, filters);
  })
});