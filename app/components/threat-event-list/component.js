import Ember from 'ember';
import filterComponents from 'diesel/utils/filter-risk-components';
export default Ember.Component.extend({
  tagName: 'table',
  classNames: ['base-table'],
  filteredThreatEvents: Ember.computed('filters.relevance', 'filters.sort', 'filters.impact', 'filters.search', 'threatEvents.[]', function() {
    let threatEvents = this.get('threatEvents');
    let filters = this.get('filters');

    return filterComponents(threatEvents, filters);
  })
});