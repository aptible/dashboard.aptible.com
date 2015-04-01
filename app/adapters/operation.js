import ApplicationAdapter from './application';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';

export default ApplicationAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'databases':   {property: 'database.id'},
    'apps':        {property: 'app.id'},
    'vhosts':      {property: 'vhost.id'},
    'log_drains':  {property: 'logDrain.id'},
    'services':    {property: 'service.id'}
  }),

  findQuery: function(store, type, query){
    let url = this.buildURL(type.typeKey, null, null, 'findQuery');

    if (this.sortQueryParams) {
      query = this.sortQueryParams(query);
    }

    if (query.app) {
      url = url.replace('/operations', `/apps/${query.app.id}/operations`);
      delete query.app;
    } else if (query.database) {
      url = url.replace('/operations', `/databases/${query.database.id}/operations`);
      delete query.database;
    }

    return this.ajax(url, 'GET', {data:query});
  }
});
