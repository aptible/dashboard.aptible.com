import Ember from 'ember';
let get = Ember.get;

// `requestType` is passed as the 4th argument to buildURL as of https://github.com/emberjs/data/commit/e8ceeeb4c099ab084a603c2b2564c56197c65fc5
// This is not yet in a released version of ember-data but we need it to enable
// fine-grained control over our URLs (to make it easy to prepend a string to the URL only for deletes, say),
// so we pull in that code here
//
// After the next ember-data release (> 1.0.0.beta-16.1), this mixin
// should be able to be removed (and the ApplicationAdapter can stop extending it)

export default Ember.Mixin.create({
  deleteRecord: function(store, type, snapshot){
    let id = snapshot.id;
    let url = this.buildURL(type.typeKey, id, snapshot, 'deleteRecord');
    return this.ajax(url, "DELETE");
  },

  find: function(store, type, id, snapshot) {
    return this.ajax(this.buildURL(type.typeKey, id, snapshot, 'find'), 'GET');
  },

  findAll: function(store, type, sinceToken) {
    var query, url;

    if (sinceToken) {
      query = { since: sinceToken };
    }

    url = this.buildURL(type.typeKey, null, null, 'findAll');

    return this.ajax(url, 'GET', { data: query });
  },

  findQuery: function(store, type, query) {
    var url = this.buildURL(type.typeKey, null, null, 'findQuery');

    if (this.sortQueryParams) {
      query = this.sortQueryParams(query);
    }

    return this.ajax(url, 'GET', { data: query });
  },

  findMany: function(store, type, ids, snapshots) {
    var url = this.buildURL(type.typeKey, ids, snapshots, 'findMany');
    return this.ajax(url, 'GET', { data: { ids: ids } });
  },

  findHasMany: function(store, snapshot, url/*, relationship*/) {
    var host = get(this, 'host');
    var id   = snapshot.id;
    var type = snapshot.typeKey;

    if (host && url.charAt(0) === '/' && url.charAt(1) !== '/') {
      url = host + url;
    }

    url = this.urlPrefix(url, this.buildURL(type, id, null, 'findHasMany'));

    return this.ajax(url, 'GET');
  },

  findBelongsTo: function(store, snapshot, url/*, relationship*/) {
    var id   = snapshot.id;
    var type = snapshot.typeKey;

    url = this.urlPrefix(url, this.buildURL(type, id, null, 'findBelongsTo'));
    return this.ajax(url, 'GET');
  },

  createRecord: function(store, type, snapshot) {
    var data = {};
    var serializer = store.serializerFor(type.typeKey);
    var url = this.buildURL(type.typeKey, null, snapshot, 'createRecord');

    serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

    return this.ajax(url, "POST", { data: data });
  },

  updateRecord: function(store, type, snapshot) {
    var data = {};
    var serializer = store.serializerFor(type.typeKey);

    serializer.serializeIntoHash(data, type, snapshot);

    var id = snapshot.id;
    var url = this.buildURL(type.typeKey, id, snapshot, 'updateRecord');

    return this.ajax(url, "PUT", { data: data });
  }
});
