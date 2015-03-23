import Ember from 'ember';

export default Ember.Controller.extend({
  isDisabled: function(){
    if (this.get('model.isSaving')) { return true; }

    let email = this.get('model.email'),
        roleId = this.get('model.role.id');

    return Ember.isBlank(email) || Ember.isBlank(roleId);
  }.property('model.isSaving', 'model.email', 'model.role.id')
});

