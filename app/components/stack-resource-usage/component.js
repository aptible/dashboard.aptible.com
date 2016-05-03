import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',

  resources: Ember.computed('stack', 'resource', function() {
    let firstLevel = { container: 'apps', disk: 'databases',
      domain: 'apps' }[this.get('resource')];
    return this.get('stack').get(firstLevel);
  })
});
