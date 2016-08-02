import Ember from 'ember';

export default Ember.Component.extend({
  service: null,
  isSaving: false,
  containerSize: null,
  containerCount: null,

  isSliding: false,

  init() {
    this._super(...arguments);
    this.set('containerSize', this.get('service.containerSize'));
    this.set('containerCount', this.get('service.containerCount'));
  },

  isv2Stack: Ember.computed.equal('service.stack.sweetnessStackVersion', 'v2'),
  isv1Stack: Ember.computed.not('isv2Stack'),

  shouldDisable: Ember.computed.or('isv1Stack', 'isSaving'),
  hasCountChanged: Ember.computed('containerCount', 'service.containerCount', function() {
    return this.get('containerCount') !== this.get('service.containerCount');
  }),

  hasSizeChanged: Ember.computed('containerSize', 'service.containerSize', function() {
    return this.get('containerSize') !== this.get('service.containerSize');
  }),

  showActionButtons: Ember.computed.or('hasCountChanged', 'hasSizeChanged'),

  unitOfMeasure: Ember.computed('service.stack.type', function() {
    var type = this.get('service.stack.type');
    return type ? type.capitalize() + " App Container" : '';
  }),

  actions: {
    setContainerSize(value){
      this.set('isSliding', true);
      this.set('containerSize', value);
    },

    setContainerCount(value){
      this.set('isSliding', true);
      this.set('containerCount', value);
    },

    finishSliding(){
      this.set('isSliding', false);
    },

    cancel(){
      this.set('containerSize', this.get('service.containerSize'));
      this.set('containerCount', this.get('service.containerCount'));

      // this resets no-ui-slider, as it doesn't have a simple way to
      // pass in the changed value
      this.rerender();
    },

    scale(){
      if (this.get('isSaving')) { return; }

      let component = this;

      let {
        service, containerSize, containerCount
      } = this.getProperties('service', 'containerSize', 'containerCount');

      this.set('isSaving', true);

      var deferred = Ember.RSVP.defer();
      this.sendAction('scaleService', service, containerCount, containerSize, deferred);

      deferred.promise.then(() => {
        if (component.isDestroyed) { return; }

        component.set('success', service.get('processType') + ' scaled to ' + containerCount + ' ' + containerSize + 'MB' + ' containers');
      }).catch(function(e){
        if (component.isDestroyed) { return; }

        component.set('error', e.message);
      }).finally(function(){
        if (component.isDestroyed) { return; }

        component.set('isSaving', false);
      });
    },

    clearMessages() {
      this.set('error', false);
      this.set('success', false);
    }

  }
});
