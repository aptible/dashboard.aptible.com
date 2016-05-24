import Ember from 'ember';

export default Ember.Route.extend({
  model() {
   let component = {
    title: 'Spear Phishing', description: 'Spear Phishing Description'
   };

   return component;
  }
});
