import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  maxVisibleDomainNames: 1,

  displayVhostNames: Ember.computed('model.vhostNames', function() {
    return this.model.get('vhostNames').join(', ');
  }),

  showVhostTooltip: Ember.computed('model.vhostNames', function() {
    return this.model.get('vhostNames.length') > this.get('maxVisibleDomainNames');
  }),

  vhostRemaining: Ember.computed('vhostNames', function() {
    return this.model.get('vhostNames.length') - this.get('maxVisibleDomainNames');
  }),

  vhostNamesSnippet: Ember.computed('vhostNames', function() {
    let names = this.model.get('vhostNames');
    return names.slice(0, this.get('maxVisibleDomainNames')).join(', ');
  }),

  vhostNamesTooltip: Ember.computed('vhostNames', function() {
    let names = this.model.get('vhostNames');
    return names.slice(this.get('maxVisibleDomainNames')).join(', ');
  })
});
