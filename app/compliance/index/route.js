import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let model = this.modelFor('compliance');
    return this.replaceWith('compliance-organization', model.get('firstObject.id'));
  }
});

