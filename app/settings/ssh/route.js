import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    var user = this.session.get('currentUser');

    return user.get('sshKeys');
  },

  setupController: function(controller, model){
    controller.set('model', model);
  },

  actions: {
    addKey: function(){
      this.controller.set('newKey', this.store.createRecord('ssh-key', {
        user: this.session.get('currentUser')
      }));
    },

    cancelSaveKey: function(){
      this.controller.get('newKey').deleteRecord();
      this.controller.set('newKey', null);
    },

    saveKey: function(){
      var controller = this.controller;

      if (controller.get('newKey.isSaving')) { return; }

      var key = this.controller.get('newKey');

      key.save().then(function(){
        controller.set('newKey', null); // clear key
      }).catch((e) => {
        Ember.get(this, 'flashMessages').danger(e.message);
      });
    },

    deleteKey: function(key){
      key.destroyRecord().then(() => {
        let message = `${key.get('name')} deleted`;
        Ember.get(this, 'flashMessages').success(message);
      }).catch(() => {
        let message = 'There was an error deleting this key.';
        Ember.get(this, 'flashMessages').danger(message);
        key.rollback();
      });
    }
  }
});
