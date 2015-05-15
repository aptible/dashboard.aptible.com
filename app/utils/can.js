import Ember from 'ember';

export default function can(user, scope, permittable){
  Ember.assert('Must pass a parameter that implements `permitsRole`',
               !!permittable.permitsRole);

  if (scope === "read" || user.get('verified')) {
    return user.get('roles').then(function(roles){
      return Ember.RSVP.all(roles.map((role) => permittable.permitsRole(role, scope)) );
    }).then((results) => {
      return results.indexOf(true) > -1;
    });
  } else {
    return Ember.RSVP.resolve(false);
  }

}
