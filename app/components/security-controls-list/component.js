import Ember from 'ember';
import filterComponents from 'diesel/utils/filter-risk-components';
import ColumnConfigMixin from 'diesel/mixins/components/column-config';

const COLUMN_PRESETS = {
  'title': 'Security Control',
  'description': 'Description',
  'status': 'Status',
  'vulnerabilities': 'Vulnerabilities',
  'actions': ''
};

export default Ember.Component.extend(ColumnConfigMixin, {
  filters: { search: '', sort: null, pervasiveness: null },
  tagName: 'table',
  classNames: ['base-table'],

  columns: ['title', 'description', 'status', 'vulnerabilities', 'actions'],
  columnPresets: COLUMN_PRESETS,

  filteredSecurityControls: Ember.computed('filters.status', 'filters.sort', 'filters.search', 'securityControls.[]', function() {
    let securityControls = this.get('securityControls');
    let filters = this.get('filters');
    // For now, let's omit any security controls missing a title.  We will soon
    // seed the risk graph with all needed data.
    securityControls = securityControls.rejectBy('title', '');
    return filterComponents(securityControls, filters);
  })
});