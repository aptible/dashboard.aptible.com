import Ember from 'ember';
import filterComponents from 'diesel/utils/filter-risk-components';
export default Ember.Component.extend({
  filters: { search: '', sort: null, pervasiveness: null },
  tagName: 'table',
  classNames: ['base-table'],

  filteredThreatSources: Ember.computed('filters.adversarial', 'filters.sort', 'filters.search', 'threatSources.[]', function() {
    let threatSources = this.get('threatSources');
    let filters = this.get('filters');

    return filterComponents(threatSources, filters);
  })
});