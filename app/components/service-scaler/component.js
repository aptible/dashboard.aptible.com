import Ember from 'ember';

export default Ember.Component.extend({
  service: null,
  isSaving: false,
  containerCount: null,

  isSliding: false,

  showActionButtons: function(){
    if (this.get('isSliding')) { return false; }

    return this.get('containerCount') !==
      this.get('service.containerCount');
  }.property('isSliding', 'containerCount', 'service.containerCount'),

  initializeContainerCount: function(){
    this.set( 'containerCount', this.get('service.containerCount') );
  }.on('init').observes('service.containerCount'),

  unitOfMeasure: function() {
    var type = this.get('service.stack.type');
    return type ? type.capitalize() + " App Container" : '';
  }.property('service.stack.type'),

  actions: {
    setContainerCount: function(value){
      this.set('isSliding', true);
      this.set('containerCount', value);
    },

    finishSliding: function(){
      this.set('isSliding', false);
    },

    cancel: function(){
      this.set('containerCount', this.get('service.containerCount'));

      // this resets no-ui-slider, as it doesn't have a simple way to
      // pass in the changed value
      this.rerender();
    },

    scale: function(){
      if (this.get('isSaving')) { return; }

      var service = this.get('service');
      var component = this;
      var containerCount = this.get('containerCount');

      this.set('isSaving', true);

      var deferred = Ember.RSVP.defer();
      this.sendAction('scaleService', service, containerCount, deferred);

      deferred.promise.catch(function(e){
        if (component.isDestroyed) { return; }

        component.set('error', e.message);
      }).finally(function(){
        if (component.isDestroyed) { return; }

        component.set('isSaving', false);
        component.set('success', service.get('processType') + ' scaled to ' + containerCount + ' containers');
      });
    },

    clearMessages: function() {
      this.set('error', false);
      this.set('success', false);
    }

  }
});
