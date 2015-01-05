import ApplicationAdapter from './application';
import buildURLWithPrefix from '../utils/build-url-with-prefix';

export default ApplicationAdapter.extend({
  buildURL: buildURLWithPrefix('service.id', 'services')
});
