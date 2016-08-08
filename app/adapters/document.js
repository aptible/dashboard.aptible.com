import GridironAdapter from './gridiron';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';

export default GridironAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'criteria': {property: 'criterion.id', only: ['create', 'index']}
  })
});