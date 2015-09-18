import StackResource from './stack-resource';

export default StackResource.extend({
  findQuery: function(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'findQuery');

    if (query.stack) {
      url = url.replace('/apps', `/accounts/${query.stack.id}/apps`);
      delete query.stack;
    }

    return this.ajax(url, 'GET', {data:query});
  }
});
