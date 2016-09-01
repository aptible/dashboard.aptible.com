import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let authorization = this.get('authorization');
    let context = authorization.get('contextsWithGridironProduct.firstObject');
    let organization = context.get('organization');

    if (context.get('userIsGridironAdmin')) {
      this.transitionTo('gridiron-admin', organization.get('id'));
    } else {
      this.transitionTo('gridiron-user', organization.get('id'));
    }
  }
});
