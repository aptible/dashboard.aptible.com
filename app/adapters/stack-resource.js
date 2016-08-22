import ApplicationAdapter from './application';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';

export default ApplicationAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'accounts': {property: 'stack.id', only: ['create', 'findquery']}
  }),

  findQuery(store, type, query) {
    if(!query.stack) {
      return this._super(...arguments);
    }

    let record = store.createRecord(type.modelName, { stack: query.stack });
    let url = this.buildURL(type.modelName, null, { record: record }, 'findquery');

    record.rollback();
    delete query.stack;
    return this.ajax(url, 'GET', { data: query });
  }
});
