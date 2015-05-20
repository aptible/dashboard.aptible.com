import Ember from 'ember';

export default Ember.Component.extend({
  className: ['dashboard-dropdown'],
  isOpen: false,

  init: function(){
    this._super();
    this.eventName = 'click.'+Ember.guidFor(this);
    this.body = Ember.$(document.body);
  },

  updateDocumentClickListener: Ember.observer('isOpen', function(){
    var component = this;

    if (!this.get('isOpen')) {
      this.detachDocumentClickListener();
      return;
    }

    this.body.on(this.eventName, function(event){
      if (component.isDestroyed || Ember.$.contains(component.element, event.target)) {
        return;
      }
      Ember.run(function(){
        component.set('isOpen', false);
      });
    });
  }),

  detachDocumentClickListener: Ember.on('willDestroyElement', function(){
    this.body.off(this.eventName);
  }),

  actions: {
    toggle: function(){
      this.toggleProperty('isOpen');
    }
  }
});
