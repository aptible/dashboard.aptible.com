import Ember from 'ember';

const SORT = [
  { title: 'Highest Pervasiveness', value: 'pervasiveness' },
  { title: 'Title', value: 'title' }
];

const PERVASIVENESSES = [
  { title: 'All Systems', value: 4 },
  { title: 'Most Systems', value: 3 },
  { title: 'Many Systems', value: 2 },
  { title: 'Some Systems', value: 1 },
  { title: 'Few Systems', value: 0 }
];

export default Ember.Component.extend({
  filters: { search: '', sort: SORT[0].value, pervasiveness: null },

  classNames: ['risk-assessment__filters form-inline'],
  sorts: SORT,
  pervasivenesses: PERVASIVENESSES,

  showClear: Ember.computed('filters.search', 'filters.pervasiveness', function() {
    let currentSearch = this.get('filters.search') || '';
    let pervasiveness = this.get('filters.pervasiveness');

    return Ember.$.trim(currentSearch) !== '' ||
           (pervasiveness && pervasiveness !== '');
  }),

  actions: {
    clear() {
      this.set('filters.sort', SORT[0].value);
      this.set('filters.pervasiveness', null);
      this.set('filters.search', '');
    },

    update() {
      let sort = this.$('select.sort').val();
      let pervasiveness = parseInt(this.$('select.pervasiveness').val(), 10);

      this.set('filters.sort', sort);
      this.set('filters.pervasiveness', pervasiveness);
    }
 }
});
