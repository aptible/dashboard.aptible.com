import Ember from 'ember';
import sum from '../../utils/sum';

export default Ember.Component.extend({
  tagName: '',
  maxVisibleDomainNames: 2,

  persistedApps: Ember.computed.filterBy('model.apps', 'isNew', false),
  persistedDatabases: Ember.computed.filterBy('model.databases', 'isNew', false),
  persistedVhosts: Ember.computed.filterBy('model.vhosts', 'isNew', false),
  vhostNames: Ember.computed.mapBy('persistedVhosts', 'commonName'),

  displayVhostNames: Ember.computed('vhostNames', function() {
    return this.get('vhostNames').join(', ');
  }),

  showVhostTooltip: Ember.computed('vhostNames', function() {
    return this.get('vhostNames.length') > this.get('maxVisibleDomainNames');
  }),

  vhostRemaining: Ember.computed('vhostNames', function() {
    return this.get('vhostNames.length') - this.get('maxVisibleDomainNames');
  }),

  vhostNamesSnippet: Ember.computed('vhostNames', function() {
    let names = this.get('vhostNames');
    return names.slice(0, this.get('maxVisibleDomainNames')).join(', ');
  }),

  vhostNamesTooltip: Ember.computed('vhostNames', function() {
    let names = this.get('vhostNames');
    return names.slice(this.get('maxVisibleDomainNames')).join(', ');
  }),

  totalDiskSize: function(){
    let sizes = this.get('persistedDatabases').mapBy('disk.size').compact();
    return sum(sizes);
  }.property('persistedDatabases.[]'),

  totalContainerCount: function(){
    let containerCounts = [];
    this.get('persistedApps').forEach(function(app){
      let counts = app.get('services').mapBy('containerCount').compact();
      containerCounts = containerCounts.concat(counts);
    });

    return sum(containerCounts);
  }.property('persistedApps.[]')
});
