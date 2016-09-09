import Ember from 'ember';

export default Ember.Component.extend({
  text: 'Reveal',
  hidden: true,
  actions: {
    reveal() {
      this.set('hidden', false);
    }
  }
});
