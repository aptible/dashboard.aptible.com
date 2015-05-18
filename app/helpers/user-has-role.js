import Ember from 'ember';

export function userHasRole(params/*, hash*/) {
  let [user, role] = params;
  return user.get('roles').contains(role);
}

export default Ember.HTMLBars.makeBoundHelper(userHasRole);
