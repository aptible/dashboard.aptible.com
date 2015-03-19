import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  primaryPhone: DS.attr('string'),
  emergencyPhone: DS.attr('string'),
  city: DS.attr('string'),
  state: DS.attr('string'),
  zip: DS.attr('string'),
  address: DS.attr('string'),
  plan: DS.attr('string'),

  users: DS.hasMany('users', {async: true}),

  permitsRole(role, scope){
    return new Ember.RSVP.Promise( (resolve) => {
      let roleOrganizationHref = role.get('data.links.organization');
      let regex = /organizations\/(.*)/;
      let match = regex.exec(roleOrganizationHref);
      let roleOrganizationId = match[1];

      let result = roleOrganizationId === this.get('id');
      if (scope === 'manage') {
        result = result && role.get('privileged');
      }

      resolve(result);
    });
  }
});
