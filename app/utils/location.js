import Ember from 'ember';

let Location = {
  replace(url) {
    window.location = url;
  },

  replaceAndWait(url) {
    Location.replace(url);
    // never-resolving promise
    return new Ember.RSVP.Promise(() => {});
  }
};

export default Location;
