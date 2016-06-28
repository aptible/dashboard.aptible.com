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

  updateIsChecked(){
    const value = this.get('changeset').value(this._stagedObjectKey);
    this.set('isChecked', value.isEnabled);
  },

  click(){
    const isChecked = this.$().is(':checked');
    const value = this.get('changeset').value(this._stagedObjectKey);
    this.get('changeset').setValue(
      this._stagedObjectKey, {permission: value.permission, isEnabled:!!isChecked});
  }

});
