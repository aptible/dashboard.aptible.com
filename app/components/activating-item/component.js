import Ember from 'ember';
import layout from '../../templates/components/activating-item';

export default Ember.Component.extend({
  routingService: Ember.inject.service('routing'),
  layout: layout,
  classNameBindings: ['active'],

  currentWhen: null,

  active: Ember.computed('routingService.currentPath', 'currentWhen', function() {
    let currentPath = this.get('routingService.currentPath');
    let currentWhen = this.get('currentWhen');
    let offset = currentPath.indexOf(currentWhen);
    // with our without dashboard prefix
    return offset === 0 || (offset === 10 && currentPath.indexOf('dashboard') === 0);
  })
});
