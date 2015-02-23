import Ember from "ember";
import sum from '../utils/sum';

export default Ember.Controller.extend({
  hasMultipleStacks: Ember.computed.gt('stacks.length', 1),

  persistedApps: Ember.computed.filterBy('model.apps', 'isNew', false),
  persistedDatabases: Ember.computed.filterBy('model.databases', 'isNew', false),

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
