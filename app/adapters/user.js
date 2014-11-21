import config from "../config/environment";
import ApplicationAdapter from "../application/adapter";

export default ApplicationAdapter.extend({
  host: config.authBaseUri
});
