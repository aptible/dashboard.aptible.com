import Ember from 'ember';

export default Ember.Component.extend({
  className: ['dashboard-dropdown'],
  isOpen: false,

  title: Ember.computed('user.name', 'actor.name',  function () {
    let userName = this.get('user.name'),
        actorName = this.get('actor.name');
    if (actorName) {
      return `${actorName} (as ${userName})`;
    }
    return userName;
  }),

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
