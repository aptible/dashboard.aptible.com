import AuthAdapter from './auth';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';

export default AuthAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'roles': {property: 'role.id', only:['create','update']}
  })
});
