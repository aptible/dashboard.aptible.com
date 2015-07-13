import BillingDetailAdapter from './billing-detail';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';

export default BillingDetailAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'organizations': {property: 'organization.id'}
  })
});
