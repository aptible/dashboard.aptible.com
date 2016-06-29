import Ember from 'ember';

export default Ember.Component.extend({
  actionComponents: Ember.computed("vhost.actionsRequired.[]", function() {
    return this.get("vhost.actionsRequired").map((action) => {
      return `vhost-action-required-${action}`;
    });
  })
});
