import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['data-environment-index'],
  tagName: '',
  sortBy: ['displayProperties.ordinal'],
  unsortedDataEnvironments: Ember.computed.alias('dataEnvironmentSchema.properties'),
  dataEnvironments: Ember.computed.sort('unsortedDataEnvironments', 'sortBy'),
  f: Ember.computed('dataEnvironmentSchema', function() {
    debugger;
  })
});
