import ApplicationAdapter from '../application/adapter';
import buildURLWithPrefix from '../utils/build-url-with-prefix';

export default ApplicationAdapter.extend({
  buildURL: buildURLWithPrefix('stack.id', 'accounts')
});
