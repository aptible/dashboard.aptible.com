import ApplicationAdapter from './application';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';

export default ApplicationAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'databases':   {property: 'database.id', only:['create', 'index']}
  }),

  findQuery: function(store, type, query){
    let url = this.buildURL(type.modelName, null, null, 'findQuery');

    if (this.sortQueryParams) {
      query = this.sortQueryParams(query);
    }

    if (query.database) {
      url = url.replace('/backups', `/databases/${query.database.id}/backups`);
      delete query.database;
    }

    return this.ajax(url, 'GET', {data: query});
  }
});

