import Ember from 'ember';

export default function can(user, scope, permittablePromise){
  if(scope === 'manage' && !user.get('verified')) {
    return Ember.RSVP.resolve(false);
  }

  let permittable;

  return new Ember.RSVP.Promise(function(resolve) {
    // Ensure permittable is resolved as a model and not a promise
    resolve(permittablePromise);
  }).then(function(resolvedPermittable) {
    Ember.assert('Must pass a parameter that implements `permitsRole`', !!resolvedPermittable.permitsRole);
    permittable = resolvedPermittable;
    return user.get('roles');
  }).then(function(roles){
    return Ember.RSVP.all(roles.map((role) => permittable.permitsRole(role, scope)) );
  }).then((results) => {
    return results.indexOf(true) > -1;
  });

}
