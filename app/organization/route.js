import Ember from 'ember';
import { replaceLocation } from "../utils/location";
import config from '../config/environment';

export default Ember.Route.extend({
  beforeModel: function() {
    var params = this.paramsFor('organization');
    this._super.apply(this, arguments).then(() => {
      if (!this.features.isEnabled('organization-settings')) {
        replaceLocation();
        var host = config.aptibleHosts['legacy-dashboard'];
        var url = [host, 'organizations', params.organization_id].join('/');
        replaceLocation(url);
        // Hang this transition
        return new Ember.RSVP.Promise(() => {});
      }
    });
  }
});
