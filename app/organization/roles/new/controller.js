import Ember from 'ember';

export default Ember.Controller.extend({
  saveButtonName: 'Save',
  isUnchanged: Ember.computed.not('model.isDirty')
});

