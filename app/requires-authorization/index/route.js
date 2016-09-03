import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let authorization = this.get('authorization');
    let context = authorization.get('organizationContexts.firstObject');

    if(context.get('organizationHasEnclaveProduct') && context.get('hasEnclaveAccess')) {
      return this.transitionTo('enclave');
    }

    if(context.get('organizationHasGridironProduct')) {
      return this.transitionTo('gridiron');
    }

    this.transitionTo('enclave');
  }
});
