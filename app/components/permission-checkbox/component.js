import Ember from 'ember';


/* Example usage:
 *
  {{permission-checkbox
    scope="manage"
    stack=stack
    role=role
    changeset=manageChangeset}}

*/

export default Ember.Component.extend({
  tagName: 'input',
  classNames: ['permission-checkbox'],
  attributeBindings: ['checked', 'type', 'disabled'],
  type: 'checkbox',
  checked: Ember.computed.or('isChecked', 'disabled'),

  isChecked: null,

  disabled: Ember.computed.reads('role.privileged'),

  init() {
    this._super();
    this._stagedObjectKey = {
      stack: this.get('stack'),
      scope: this.get('scope'),
      role: this.get('role')
    };

    this.updateIsChecked();
    this.changeset.subscribe(this._stagedObjectKey, () => {
      this.updateIsChecked();
    });
  },

  updateIsChecked(){
    const value = this.changeset.value(this._stagedObjectKey);
    this.set('isChecked', value.isEnabled);
  },

  click(){
    const isChecked = this.$().is(':checked');
    const value = this.changeset.value(this._stagedObjectKey);
    this.changeset.setValue(
      this._stagedObjectKey, {permission: value.permission, isEnabled:!!isChecked});
  }

});
