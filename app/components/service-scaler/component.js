import Ember from 'ember';

export default Ember.Component.extend({
  service: null,
  isSaving: false,
  containerSize: null,
  containerCount: null,

  isSliding: false,

  shouldDisable: Ember.computed('isV1Stack', 'isSaving', function() {
    return this.get('isV1Stack') || this.get('isSaving');
  }),

  isv1Stack: function() {
    let sweetnessVersion = this.get('service.stack.sweetnessStackVersion');
    return !(sweetnessVersion && sweetnessVersion === "v2");
  }.property('service.stack.sweetnessStackVersion'),

  showActionButtons: function(){
    if (this.get('isSliding')) { return false; }

    return (this.get('containerCount') !==
      this.get('service.containerCount')) || (this.get('containerSize') !==
      this.get('service.containerSize'));
  }.property('isSliding', 'containerSize', 'service.containerSize', 'containerCount', 'service.containerCount'),

  initializeContainerSize: function(){
    this.set( 'containerSize', this.get('service.containerSize') );
  }.on('init').observes('service.containerSize'),

  initializeContainerCount: function(){
    this.set( 'containerCount', this.get('service.containerCount') );
  }.on('init').observes('service.containerCount'),

  unitOfMeasure: function() {
    var type = this.get('service.stack.type');
    return type ? type.capitalize() + " App Container" : '';
  }.property('service.stack.type'),

  actions: {
    setContainerSize: function(value){
      this.set('isSliding', true);
      this.set('containerSize', value);
    },

    setContainerCount: function(value){
      this.set('isSliding', true);
      this.set('containerCount', value);
    },

    finishSliding: function(){
      this.set('isSliding', false);
    },

    cancel: function(){
      this.set('containerSize', this.get('service.containerSize'));
      this.set('containerCount', this.get('service.containerCount'));

      // this resets no-ui-slider, as it doesn't have a simple way to
      // pass in the changed value
      this.rerender();
    },

    scale: function(){
      if (this.get('isSaving')) { return; }

      var service = this.get('service');
      var component = this;

      var containerSize = this.get('containerSize');
      var containerCount = this.get('containerCount');

      this.set('isSaving', true);

      var deferred = Ember.RSVP.defer();
      this.sendAction('scaleService', service, containerCount, containerSize, deferred);

      deferred.promise.catch(function(e){
        if (component.isDestroyed) { return; }

        component.set('error', e.message);
      }).finally(function(){
        if (component.isDestroyed) { return; }

        component.set('isSaving', false);
        component.set('success', service.get('processType') + ' scaled to ' + containerCount + ' ' + containerSize + 'MB' + ' containers');
      });
    },

    clearMessages: function() {
      this.set('error', false);
      this.set('success', false);
    }

  }
});
