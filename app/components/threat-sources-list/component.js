import Ember from 'ember';
import filterComponents from 'diesel/utils/filter-risk-components';
import ColumnConfigMixin from 'diesel/mixins/components/column-config';

const COLUMN_PRESETS = {
  'title': 'Threat Source',
  'description': 'Description',
  'adversarial': 'Adversarial',
  'rangeOfEffects': 'Range of Effects',
  'threatVector': 'Threat Vector',
  'actions': ''
};

export default Ember.Component.extend(ColumnConfigMixin, {
  filters: { search: '', sort: null, pervasiveness: null },
  tagName: 'table',
  classNames: ['base-table'],

  columns: ['title', 'description', 'adversarial', 'rangeOfEffects', 'threatVector', 'actions'],
  columnPresets: COLUMN_PRESETS,

  filteredThreatSources: Ember.computed('filters.adversarial', 'filters.sort', 'filters.search', 'threatSources.[]', function() {
    let threatSources = this.get('threatSources');
    let filters = this.get('filters');

    return filterComponents(threatSources, filters);
  })
});