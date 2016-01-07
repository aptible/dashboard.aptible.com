import config from "../config/environment";
import ApplicationAdapter from "./application";

export const PATHS_FOR_TYPES = {
  criterion: 'criteria'
}

export default ApplicationAdapter.extend({
  host: config.gridironBaseUri,

  pathForType: function(type){
    return PATHS_FOR_TYPES[type] || this._super(type);
  }
});
