import Ember from "ember";
import config from '../../config/environment';

let gettingStartedDocs = config.externalUrls.gettingStartedDocs;

export default Ember.Route.extend({
  model: function(){
    let app = this.modelFor('app');
    let currentUser = this.session.get('currentUser');

    return Ember.RSVP.hash({
      app: app,
      sshKeys: currentUser.get('sshKeys')
    });
  },

  setupController: function(controller, model){
    controller.set('model', model.app);
    controller.set('sshKeys', model.sshKeys);
    controller.set('gettingStartedDocs', gettingStartedDocs);
  }
});
