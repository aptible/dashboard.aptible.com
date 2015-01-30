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
      this.controller.set('error', null);
    },

    saveKey: function(){
      var controller = this.controller;

      if (controller.get('newKey.isSaving')) { return; }

      var key = this.controller.get('newKey');

      key.save().then(function(){
        controller.set('error', null); // clear error
        controller.set('newKey', null); // clear key
      }).catch(function(e){
        controller.set('error', e.message);
      });
    },

    deleteKey: function(key){
      var controller = this.controller;

      key.destroyRecord().then(function(){
        controller.set('error', null);
      }).catch(function(){
        controller.set('error', 'There was an error deleting this key.');
        key.rollback();
      });
    }
  }
});
