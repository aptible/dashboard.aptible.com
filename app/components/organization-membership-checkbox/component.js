import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'input',
  attributeBindings: ['type', 'checked', 'name', 'disabled'],
  type: 'checkbox',
  name: 'user-role',

  disabled: Ember.computed.reads('isDisabled'),
  checked: Ember.computed.reads('isChecked'),

  init(){
    this._super.apply(this, arguments);

    this._stagedObjectKey = {
      organizationRole: this.get('organizationRole'),
      user: this.get('user')
    };

    this.updateUI();
    this.get('changeset').subscribeAll(() => this.updateUI());
  },

  updateUI() {
    this.updateCheckbox();
    this.updateDisabled();
  },

  updateCheckbox() {
    const isChecked = this.get('changeset').value(this._stagedObjectKey);
    this.set('isChecked', isChecked);
  },

  updateDisabled() {
    let activeMemberships = [];
    this.get('changeset').forEachValue((keyData, initialValue, value) => {
      if (value === true) { activeMemberships.push(keyData); }
    });
    const isDisabled = activeMemberships.length === 1 &&
      activeMemberships[0] === this._stagedObjectKey;

    this.set('isDisabled', isDisabled);
  },

  click() {
    const isChecked = this.$().is(':checked');
    this.get('changeset').setValue(this._stagedObjectKey, isChecked);
  }

});
