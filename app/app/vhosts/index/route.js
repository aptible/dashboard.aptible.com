import Ember from "ember";

export default Ember.Route.extend({
  titleToken: function(){
    var app = this.modelFor('app');
    return `${app.get('handle')} Domains`;
  },
  redirect: function(model) {
    if(model.get('length') === 0) {
      return this.transitionTo('app.vhosts.new', this.modelFor('app'));
    }
  },

  actions: {
    delete: function(vhost){
      let op = this.store.createRecord('operation', {
        type: 'deprovision',
        vhost: vhost
      });

      this.controller.set('error', null);
      vhost.set('isDeleting', true);

      op.save().then( () => {
        vhost.deleteRecord();
      }).catch( () => {
        this.controller.set('error', 'There was an error deleting the VHost');
      }).finally( () => {
        vhost.set('isDeleting', false);
      });
    }
  }
});
