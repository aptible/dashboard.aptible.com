import Ember from 'ember';

export default Ember.Component.extend({
  updateValue: Ember.computed('role.type', function() {
    let roleType = this.get('role').get('type');
    this.$('.role-type-select').data('role-type', roleType);
  }),

  click(jqEvent) {
    let role = this.get('role');
    let roleType = $(jqEvent.target.closest('.role-type-option')).data('option-value');
    role.set('type', roleType);
  }
});
