import Ember from 'ember';

export default Ember.Controller.extend({
  isUnchanged: Ember.computed.not('model.isDirty')
});
