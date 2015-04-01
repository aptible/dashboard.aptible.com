import AuthAdapter from './auth';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';
import Ember from 'ember';

export default AuthAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'organizations': 'organization.id'
  }),

  // https://github.com/emberjs/data/blob/ff35ee78bfac058afb7a715a5dfc5760218cc05c/packages/ember-data/lib/adapters/rest-adapter.js#L561
  // To update a Role, the adapter should send a PUT request to /roles/:id,
  // so we override updateRecord and remove the prepended /organizations/:organization
  // that `buildURL` adds
  updateRecord: function(store, type, snapshot){
    let data = {};
    let serializer = store.serializerFor(type.typeKey);

    serializer.serializeIntoHash(data, type, snapshot);

    let id = snapshot.id;
    let url = this.buildURL(type.typeKey, id, snapshot, 'updateRecord');

    let organizationId = Ember.get(snapshot, 'organization.id');
    if (organizationId) {
      url = url.replace(`/organizations/${organizationId}`, "");
    }

    return this.ajax(url, "PUT", { data: data });
  }
});
