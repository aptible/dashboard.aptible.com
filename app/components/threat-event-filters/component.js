import Ember from 'ember';
import SIX_POINT_SCALE from 'diesel/utils/six-point-scale';

const SORT = [
  { title: 'Highest Risk Level', value: 'riskLevel' },
  { title: 'Highest Relevance', value: 'relevance' },
  { title: 'Highest Impact', value: 'impact' },
  { title: 'Title', value: 'title' }
];

export default Ember.Component.extend({
  filters: { search: '', sort: SORT[0].value, relevance: null, riskLevel: null },

  classNames: ['risk-assessment__filters form-inline'],
  sorts: SORT,
  relevances: SIX_POINT_SCALE,
  impacts: SIX_POINT_SCALE.slice(1),
  riskLevels: SIX_POINT_SCALE.slice(1),

  showClear: Ember.computed('filters.search', 'filters.riskLevel', 'filters.relevance', 'filters.impact', function() {
    let currentSearch = this.get('filters.search') || '';
    let relevance = this.get('filters.relevance');
    let impact = this.get('filters.impact');
    let level = this.get('filters.riskLevel');

    return Ember.$.trim(currentSearch) !== '' ||
           (relevance && relevance !== '') ||
           (impact && impact !== '') ||
           (level && level !== '');
  }),

  actions: {
    clear() {
      this.set('filters.sort', SORT[0].value);
      this.set('filters.riskLevel', null);
      this.set('filters.relevance', null);
      this.set('filters.impact', null);
      this.set('filters.search', '');
    },

    update() {
      let sort = this.$('select.sort').val();
      let relevance = parseInt(this.$('select.relevance').val(), 10);
      let impact = parseInt(this.$('select.impact').val(), 10);
      let riskLevel = parseInt(this.$('select.riskLevel').val(), 10);
      this.set('filters.sort', sort);
      this.set('filters.relevance', relevance);
      this.set('filters.impact', impact);
      this.set('filters.riskLevel', riskLevel);
    }
 }
});
