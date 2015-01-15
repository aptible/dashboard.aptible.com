import Ember from 'ember';

export default Ember.Component.extend({
  service: null,
  isSaving: false,
  containerCount: null,

  isDirty: function(){
    return this.get('containerCount') !== this.get('service.containerCount');
  }.property('containerCount', 'service.containerCount'),

  initializeContainerCount: function(){
    this.set( 'containerCount', this.get('service.containerCount') );
  }.on('init').observes('service.containerCount'),

  actions: {
    setContainerCount: function(value){
      this.set('containerCount', value);
    },

    cancel: function(){
      this.set('containerCount', this.get('service.containerCount'));

      // this resets no-ui-slider, as it doesn't have a simple way to
      // pass in the changed value
      this.rerender();
    },

    scale: function(){
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
      });
    }
  }
});
