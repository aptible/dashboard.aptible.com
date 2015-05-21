import Ember from 'ember';
import Location from '../utils/location';
import config from '../config/environment';

export default Ember.Route.extend({
  beforeModel: function() {
    var params = this.paramsFor('organization');
    return this._super.apply(this, arguments).then(() => {
      if (!this.features.isEnabled('organization-settings')) {
        var host = config.aptibleHosts['legacy-dashboard'];
        var url = [host, 'organizations', params.organization_id].join('/');
        return Location.replaceAndWait(url);
      }
    });
  },
  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/organization', {
      into: 'dashboard',
      outlet: 'sidebar'
    });
  }
});
