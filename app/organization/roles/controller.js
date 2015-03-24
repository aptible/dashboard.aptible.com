import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    inviteTo(role) {
      let organization = this.get('organization');
      this.transitionToRoute('organization.invite', organization, {queryParams: {role}});
    }
  }
});
