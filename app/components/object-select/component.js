import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    update: function() {
      const selectedEl = this.$('select')[0];
      const selectedIndex = selectedEl.selectedIndex;
      const items = Ember.A(this.get('items'));
      const selected = items.objectAt(selectedIndex);

      if(selected) {
        this.attrs.update(selected);
      }
    }
  }
});
