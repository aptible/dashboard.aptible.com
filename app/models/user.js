import DS from 'ember-data';
import can from "../utils/can";

export default DS.Model.extend({
  email: DS.attr('string'),
  name: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),

  // relationships
  token: DS.belongsTo('token', {async: true}),
  roles: DS.hasMany('role', {async:true}),

  // check ability, returns a promise
  // e.g.: user.can('manage', stack).then(function(boolean){ ... });
  can: function(scope, stack){
    return can(this, scope, stack);
  }
});
