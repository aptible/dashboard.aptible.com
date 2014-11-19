import config from "../config/environment";

export var locationHistory = {};

var replaceLocation;
if (config.replaceLocation) {
  replaceLocation = function replaceLocation(url){
    window.location = url;
  };
} else {
  replaceLocation = function replaceLocation(url){
    locationHistory.last = url;
  };
}

export { replaceLocation };
