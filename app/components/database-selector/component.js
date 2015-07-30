import Ember from 'ember';

export default Ember.Component.extend({
  databases: null,
  selectedDatabase: null,

  // make sure that we have an initial selection
  didInitAttrs() {
    let databases = this.get('databases');

    if(databases.length > 0) {
      this.sendAction('select', databases[0]);
    }
  },

  actions: {
    change() {
      const selectedEl = this.$('select')[0];
      const selectedIndex = selectedEl.selectedIndex;
      const databases = this.get('databases');
      const selectedDatabase = databases[selectedIndex];

      if(selectedDatabase) {
        this.sendAction('select', selectedDatabase);
      }
    }
  }
});
