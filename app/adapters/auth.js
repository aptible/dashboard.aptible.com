import config from "../config/environment";
import ApplicationAdapter from "./application";

export default ApplicationAdapter.extend({
  host: config.authBaseUri
});
