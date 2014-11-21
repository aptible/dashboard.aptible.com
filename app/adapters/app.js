import ApplicationAdapter from './application';
import buildURLWithPrefix from '../utils/build-url-with-prefix';

export default ApplicationAdapter.extend({
  buildURL: buildURLWithPrefix('stack.id', 'accounts')
});
