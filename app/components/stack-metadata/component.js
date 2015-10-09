import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  maxVisibleDomainNames: 1,

  persistedVhosts: Ember.computed.filterBy('model.vhosts', 'isNew', false),
  vhostNames: Ember.computed.mapBy('persistedVhosts', 'virtualDomain'),

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
  })
});
