import Ember from 'ember';

export default Ember.Controller.extend({
  locations: Ember.computed('model', function() {
    return this.get('model').allItems().map((item) => { return item._values });
  }),

  properties: Ember.computed('locationProperties', function() {
    let locationProperties = this.get('locationProperties');
    let properties = [];


    for(var key in locationProperties) {
      properties.push({
        key: key,
        properties: locationProperties[key]
      });
    }

    return properties;
  })
});
