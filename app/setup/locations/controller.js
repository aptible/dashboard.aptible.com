import Ember from 'ember';

export default Ember.Controller.extend({
  locations: Ember.computed('model', function() {
    return this.get('model').allItems().map((item) => { return item._values });
  }),

  // REVIEW:
  // Convert properties from hash into array.  Inject hash key as.
  // Upgrading to Ember 2.0+ for {{#each-in}} would help here.
  // http://emberjs.com/blog/2015/06/12/ember-1-13-0-released.html#toc_each-in-helper

  properties: Ember.computed('locationProperties', function() {
    let locationProperties = this.get('locationProperties');
    let properties = [];

    for(var key in locationProperties) {
      let property = locationProperties[key];

      property.key = key;
      properties.push(property);
    }

    return properties;
  })
});
