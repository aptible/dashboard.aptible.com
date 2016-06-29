import Ember from 'ember';

export default Ember.Controller.extend({
  certificatesForNewVhost: Ember.computed.filterBy("certificates", "isAcme", false)
});
