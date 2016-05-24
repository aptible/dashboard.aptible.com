import GridironAdapter from './gridiron';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';

export default GridironAdapter.extend({
  _buildURL: buildURLWithPrefixMap({
      'organization_profiles': {
        property: 'organizationProfile.id', only: ['create', 'findquery']
      }
  }),

  buildURL(type, id, snapshot, requestType, params = {}) {
    if(params.organizationProfile) {
      // When loading current attestations by handle, we need to specify an
      // organization profile ID.
      let temp = this.store.createRecord('attestation', {
        organizationProfile: params.organizationProfile
      });

      snapshot = { record: temp };
      delete params.organizationProfile;
    }

    return this._buildURL.call(this, type, id, snapshot, requestType, params);
  },

  updateRecord() {
    // Attestations are append only.  Overloading updateRecord with createRecord
    // forces attestation updates to POST rather than PUT
    return this.createRecord(...arguments);
  }
});
