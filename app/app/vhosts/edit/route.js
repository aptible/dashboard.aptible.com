import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
  title: function(){
    let app = this.modelFor('app');

    return `Edit ${this.currentModel.get('virtualDomain')} - ${app.get('handle')}`;
  },

  afterModel: function(model){
    return model.get('service');
  },

  actions: {
    save: function(){
      let controller = this.controller;
      let app = this.modelFor('app');
      let vhost = this.currentModel;

      vhost.setProperties({
        certificate: controller.get('newCertificate'),
        privateKey: controller.get('newPrivateKey'),
        app: app
      });
      vhost.save().then( () => {
        let op = this.store.createRecord('operation', {
          type: 'reprovision',
          vhost: vhost
        });
        return op.save();
      }).then( () => {
        this.transitionTo('app.vhosts.index');
      }).catch( (e) => {
        if (e instanceof DS.InvalidError) {
          // no-op
        } else {
          throw e;
        }
      });
    },

    cancel: function(){
      this.transitionTo('app.vhosts.index');
    },

    willTransition: function(){
      this.currentModel.rollback();
    }
  }
});
