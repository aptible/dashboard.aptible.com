import Ember from 'ember';

export default Ember.Component.extend({
  service: null,
  isSaving: false,
  containerCountOptions: [1,2,3,4,5,6,7,8,9,10],

  actions: {
    scale: function(){
      var service = this.get('service');
      var component = this;

      this.set('isSaving', true);

      service.save().catch(function(e){
        if (component.isDestroyed) { return; }

        component.set('error', e.message);
      }).finally(function(){
        if (component.isDestroyed) { return; }

        component.set('isSaving', false);
      });
    }
  }
});
