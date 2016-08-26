import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let model = this.modelFor('gridiron');
    return this.replaceWith('gridiron-organization', model.get('firstObject.id'));
  }
});

