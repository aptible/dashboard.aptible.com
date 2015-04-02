import Location from 'diesel/utils/location';

let originalReplaceAndWait, originalReplace;
let history = [];

export default {
  setup() {
    originalReplaceAndWait = Location.replaceAndWait;
    Location.replaceAndWait = (url) => history.push(url);
    Location.replace = (url) => history.push(url);
  },

  teardown() {
    Location.replaceAndWait = originalReplaceAndWait;
    Location.replace        = originalReplace;
    history = [];
  },

  last() {
    return history[ history.length - 1 ];
  }
};
