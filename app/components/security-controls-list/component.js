import Ember from 'ember';
import filterComponents from 'diesel/utils/filter-risk-components';

export default Ember.Component.extend({
  filters: { search: '', sort: null, pervasiveness: null },
  tagName: 'table',
  classNames: ['base-table'],
  filteredSecurityControls: Ember.computed('filters.status', 'filters.sort', 'filters.search', 'securityControls.[]', function() {
    let securityControls = this.get('securityControls');
    let filters = this.get('filters');
    // For now, let's omit any security controls missing a title.  We will soon
    // seed the risk graph with all needed data.
    securityControls = securityControls.rejectBy('title', '');
    return filterComponents(securityControls, filters);
  })
});