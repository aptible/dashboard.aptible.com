import ApplicationAdapter from './application';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'services': 'service.id'
  }),

  // https://github.com/emberjs/data/blob/64ccb96673b2396dc16424b8ab1271afa43134ca/packages/ember-data/lib/adapters/rest_adapter.js#L549
  // To update a VHost, the adapter should send a PUT request to /vhosts/:id,
  // so we override updateRecord and remove the prepended /services/:service_id
  // that `buildURL` adds
  updateRecord: function(store, type, record){
    var data = {};
    var serializer = store.serializerFor(type.typeKey);

    var snapshot = record._createSnapshot();
    serializer.serializeIntoHash(data, type, snapshot);

    var id = Ember.get(record, 'id');

    var serviceId = Ember.get(record, 'service.id');
    var url = this.buildURL(type.typeKey, id, record);
    if (serviceId) {
      url = url.replace("/services/" + serviceId, "");
    }

    return this.ajax(url, "PUT", { data: data });
  }
});
