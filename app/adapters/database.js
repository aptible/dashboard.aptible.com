import ApplicationAdapter from './application';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';

export default ApplicationAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'accounts': {property: 'stack.id', only:['create','update']}
  })
});
