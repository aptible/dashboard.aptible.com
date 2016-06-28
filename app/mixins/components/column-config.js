import Ember from 'ember';

export default Ember.Mixin.create({
  columns: [],
  columnPresets: {},
  columnConfig: Ember.computed('columns', function() {
    let enabledColumns = this.get('columns');
    let columnPresets = this.get('columnPresets');
    let config = {};

    for(var column in columnPresets) {
      config[column] = enabledColumns.indexOf(column) > -1;
    }

    return config;
  }),

  columnHeaders: Ember.computed('columns', function() {
    let columnPresets = this.get('columnPresets');
    return this.get('columns').map((c) => columnPresets[c]);
  })
});