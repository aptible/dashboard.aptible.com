import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
  multipleOrganizations: Ember.computed.gt('organizations.length', 1),

  complianceEngines: Ember.computed(function() {
    return config.complianceEngines;
  }),

  complianceTools: Ember.computed(function() {
    return config.complianceTools;
  })
});
