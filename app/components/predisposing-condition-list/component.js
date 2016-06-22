import Ember from 'ember';
import filterComponents from 'diesel/utils/filter-risk-components';

export default Ember.Component.extend({
  filters: { search: '', sort: null, pervasiveness: null },
  tagName: 'table',
  classNames: ['base-table'],
  filteredPredisposingConditions: Ember.computed('filters.pervasiveness', 'filters.sort', 'filters.search', 'predisposingConditions.[]', function() {
    let predisposingConditions = this.get('predisposingConditions');
    let filters = this.get('filters');

    return filterComponents(predisposingConditions, filters);
  })
});