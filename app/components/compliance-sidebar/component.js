import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
  multipleOrganizations: Ember.computed.gt('organizations.length', 1),
  complianceEngines: function() {
    return config.complianceEngines;
  }.property(),

  complianceTools: function() {
    return config.complianceTools;
  }.property()
});
