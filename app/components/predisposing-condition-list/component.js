import Ember from 'ember';
import filterComponents from 'diesel/utils/filter-risk-components';
import ColumnConfigMixin from 'diesel/mixins/components/column-config';
const COLUMN_PRESETS = {
  'title': 'Predisposing Conditions',
  'description': 'Description',
  'pervasiveness': 'Pervasiveness',
  'actions': ''
};

export default Ember.Component.extend(ColumnConfigMixin, {
  filters: { search: '', sort: null, pervasiveness: null },
  tagName: 'table',
  classNames: ['base-table'],

  columns: ['title', 'description', 'pervasiveness', 'actions'],
  columnPresets: COLUMN_PRESETS,

  filteredPredisposingConditions: Ember.computed('filters.pervasiveness', 'filters.sort', 'filters.search', 'predisposingConditions.[]', function() {
    let predisposingConditions = this.get('predisposingConditions');
    let filters = this.get('filters');

    return filterComponents(predisposingConditions, filters);
  })
});