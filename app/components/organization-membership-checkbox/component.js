import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'input',
  attributeBindings: ['type', 'checked', 'name'],
  type: 'checkbox',
  name: 'user-role',
  checked: Ember.computed.reads('isChecked'),

  init(){
    this._super.apply(this, arguments);

    this._stagedObjectKey = {
      organizationRole: this.organizationRole,
      user: this.user
    };

    this.updateCheckbox();
    this.changeset.subscribe(this._stagedObjectKey, () => {
      this.updateCheckbox();
    });
  },

  updateCheckbox() {
    const isChecked = this.changeset.value(this._stagedObjectKey);
    this.set('isChecked', isChecked);
  },

  click() {
    const isChecked = this.$().is(':checked');
    this.changeset.setValue(this._stagedObjectKey, isChecked);
  }

});
