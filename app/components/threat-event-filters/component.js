import Ember from 'ember';

const SORT = [
  { title: 'Highest Risk Index', value: 'appliedRiskIndex' },
  { title: 'Highest Relevance', value: 'relevance' },
  { title: 'Base Impact', value: 'baseImpact' },
  { title: 'Title', value: 'title' }
];

const RELEVANCES = [
  { title: 'Expected', value: 3 },
  { title: 'Predicted', value: 2 },
  { title: 'Possible', value: 1 },
  { title: 'Not Applicable', value: 0 }
];

const IMPACTS = [
  { title: 'Catastrophic', value: 4 },
  { title: 'Severe', value: 3 },
  { title: 'Serious', value: 2 },
  { title: 'Limited', value: 1 },
  { title: 'None', value: 0 }
];

export default Ember.Component.extend({
  filters: { search: '', sort: SORT[0], relevance: null },

  classNames: ['risk-assessment__filters form-inline'],
  sorts: SORT,
  relevances: RELEVANCES,
  impacts: IMPACTS,

  actions: {
    update() {
      let sort = this.$('select.sort').val();
      let relevance = parseInt(this.$('select.relevance').val(), 10);
      let impact = parseInt(this.$('select.impact').val(), 10);

      this.set('filters.sort', sort);
      this.set('filters.relevance', relevance);
      this.set('filters.impact', impact);
    }
 }
});
