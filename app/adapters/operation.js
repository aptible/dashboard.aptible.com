import ApplicationAdapter from './application';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';

export default ApplicationAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'databases': 'database.id',
    'apps':      'app.id',
    'vhosts':    'vhost.id'
  }),

  findQuery: function(store, type, query){
    var url;
    if (query.app) {
      url = this.buildURL(type.typeKey, null, {app: query.app});
      delete query.app;
    } else if (query.database) {
      url = this.buildURL(type.typeKey, null, {database: query.database});
      delete query.database;
    } else {
      url = this.buildURL(type.typeKey);
    }

    return this.ajax(url, 'GET', {data:query});
  }
});
