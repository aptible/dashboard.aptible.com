import Ember from 'ember';

const SORT = [
  { title: 'Highest Threat Vector', value: 'threatVector' },
  { title: 'Highest Range of Effects', value: 'rangeOfEffects' },
  { title: 'Title', value: 'title' }
];

export default Ember.Component.extend({
  filters: { search: '', sort: SORT[0], adversarial: 'any' },

  classNames: ['risk-assessment__filters form-inline'],
  sorts: SORT,

  showClear: Ember.computed('filters.search', 'filters.adversarial', function() {
    let currentSearch = this.get('filters.search') || '';
    let adversarial = this.get('filters.adversarial');

    return Ember.$.trim(currentSearch) !== '' || (!Ember.isEmpty(adversarial) && adversarial !== 'any');
  }),

  actions: {
    clear() {
      this.set('filters.sort', SORT[0].value);
      this.set('filters.adversarial', 'any');
      this.set('filters.search', '');
    },

    update() {
      let sort = this.$('select.sort').val();
      let adversarial = this.$('select.adversarial').val();
      if (adversarial !== 'any') {
        adversarial = !!parseInt(adversarial, 10);
      }

      this.set('filters.sort', sort);
      this.set('filters.adversarial', adversarial);
    }
 }
});
