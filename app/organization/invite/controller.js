import Ember from 'ember';

export default Ember.Controller.extend({
  isDisabled: Ember.computed('model.isSaving', 'model.email', 'model.role.id', function() {
    if (this.get('model.isSaving')) {
      return true;
    }

    let email = this.get('model.email'),
        roleId = this.get('model.role.id');

    return Ember.isBlank(email) || Ember.isBlank(roleId);
  })
});

