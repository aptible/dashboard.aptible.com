import BaseProvider from "torii/providers/base";
import ajax from "../utils/ajax";
import config from "../config/environment";

export default BaseProvider.extend({
  open(credentials) {
    return ajax(config.authBaseUri+'/tokens', {
      type: 'POST',
      data: credentials,
      xhrFields: { withCredentials: true }
    }).catch(function(jqXHR){
      if (jqXHR.responseJSON) {
        throw new Error(jqXHR.responseJSON.message);
      } else if (jqXHR.responseText) {
        throw new Error(jqXHR.responseText);
      } else {
        throw new Error("Unknown error from the server.");
      }
    });
  }

});
