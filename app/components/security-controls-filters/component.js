import Ember from 'ember';

const STATUSES = [
  { title: 'Implemented', value: 'implemented' },
  { title: 'Planned', value: 'planned' },
  { title: 'Unimplemented', value: 'unimplemented' }
];

export default Ember.Component.extend({
  filters: { search: '', status: null },
  classNames: ['risk-assessment__filters form-inline'],
  statuses: STATUSES,

  showClear: Ember.computed('filters.search', 'filters.status', function() {
    let currentSearch = this.get('filters.search') || '';
    let status = this.get('filters.status');

    return Ember.$.trim(currentSearch) !== '' ||
           (status && status !== '');
  }),

  actions: {
    clear() {
      this.set('filters.status', null);
      this.set('filters.search', '');
    },

    update() {
      let status = this.$('select.status').val();
      this.set('filters.status', status);
    }
 }
});
