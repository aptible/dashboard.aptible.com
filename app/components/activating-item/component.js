import Ember from 'ember';
import layout from '../../templates/components/activating-item';

export default Ember.Component.extend({
  routingService: Ember.inject.service('routing'),
  layout: layout,
  classNameBindings: ['active'],

  currentWhen: null,

  active: Ember.computed('routingService.currentPath', 'currentWhen', function() {
    return this.get('routingService.currentPath').indexOf(this.get('currentWhen')) === 0;
  })
});
