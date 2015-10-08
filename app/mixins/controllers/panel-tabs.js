import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    setPanel(panel) {
      this.set('panel', panel);
    }
  }
});
