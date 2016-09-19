import Ember from 'ember';

export default Ember.Component.extend({
  selectedDatabaseImage: Ember.computed('visibleDatabaseImages', function() {
    let dbImage = this.get('visibleDatabaseImages').find((image) => image.get('default'));
    this.get('dbImage');
    this.set('dbImage', dbImage);
    return dbImage;
  }),

  visibleDatabaseImages: Ember.computed('type', function() {
    return this.get('databaseImages').filter((image) => {
       return image.get('visible') === true && image.get('type') === this.get('type');
      }
    );
  }),

  selectImage(dbImage) {
    this.set('dbImage', dbImage);
    this.sendAction('imageSelected', this.get('dbImage'));
  }
});
