import Ember from 'ember';
import { replaceLocation } from "../utils/location";
import config from '../config/environment';

let resolve;

// needed to allow tests to finish,
// force-resolves the promise that is intended to hang while
// the page is reloaded
export function forcePromiseResolution() {
  resolve();
}

export default Ember.Route.extend({
  beforeModel: function() {
    var params = this.paramsFor('organization');
    return this._super.apply(this, arguments).then(() => {
      if (!this.features.isEnabled('organization-settings')) {
        var host = config.aptibleHosts['legacy-dashboard'];
        var url = [host, 'organizations', params.organization_id].join('/');
        replaceLocation(url);

        // Hang this transition
        return new Ember.RSVP.Promise(r => resolve = r);
      }
    });
  }
});
