import Ember from 'ember';
import { locationProperty } from './route';

export default Ember.Controller.extend({
  locations: Ember.computed('model', function() {
    return this.get('model.values');
  }),

  validLocations: Ember.computed('locations.[]', function() {
    return this.get('locations').filter((location) => {
      return locationProperty.isValid(location.values);
    });
  })
});
