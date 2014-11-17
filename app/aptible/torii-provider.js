import BaseProvider from "torii/providers/base";
import ajax from "../utils/ajax";

export default BaseProvider.extend({
  open: function(credentials){
    return ajax('/api/session', {
      type: 'POST',
      data: credentials
    }).catch(function(jqXHR){
      if (jqXHR.responseJSON) {
        throw new Error(jqXHR.responseJSON.error.message);
      } else if (jqXHR.responseText) {
        throw new Error(jqXHR.responseText);
      } else {
        throw new Error("Unknown error from the server.");
      }
    });
  }
});
