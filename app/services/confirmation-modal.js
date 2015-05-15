import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  open(modal){
    this.trigger('open', modal);
  }

});
