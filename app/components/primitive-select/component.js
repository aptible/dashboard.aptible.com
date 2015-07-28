import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    update: function() {
      let value = this.$('select').val();

      this.attrs.update(value);
    }
  }
});
