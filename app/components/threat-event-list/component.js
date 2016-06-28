import Ember from 'ember';
import filterComponents from 'diesel/utils/filter-risk-components';
import ColumnConfigMixin from 'diesel/mixins/components/column-config';

const COLUMN_PRESETS = {
  'title': 'Threat Event',
  'description': 'Description',
  'appliedRiskIndex': 'Risk Index',
  'relevanceText': 'Relevance',
  'impactText': 'Base Impact',
  'actions': ''
};

export default Ember.Component.extend(ColumnConfigMixin, {
  tagName: 'table',
  classNames: ['base-table'],

  columns: ['title', 'description', 'appliedRiskIndex', 'relevanceText', 'impactText', 'actions'],
  columnPresets: COLUMN_PRESETS,

  filteredThreatEvents: Ember.computed('filters.relevance', 'filters.sort', 'filters.impact', 'filters.search', 'threatEvents.[]', function() {
    let threatEvents = this.get('threatEvents');
    let filters = this.get('filters');

    return filterComponents(threatEvents, filters);
  })
});