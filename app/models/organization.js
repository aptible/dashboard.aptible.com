import DS from 'ember-data';
import Ember from 'ember';

let orgRegex = new RegExp('organizations/([a-zA-Z0-9\-]+)');

const UPGRADE_PLAN_REQUEST_EVENT = 'Production Upgrade Request';

export { UPGRADE_PLAN_REQUEST_EVENT };

export default DS.Model.extend({
  name: DS.attr('string'),
  primaryPhone: DS.attr('string'),
  emergencyPhone: DS.attr('string'),
  city: DS.attr('string'),
  state: DS.attr('string'),
  zip: DS.attr('string'),
  address: DS.attr('string'),
  plan: DS.attr('string'),
  opsAlertEmail: DS.attr('string'),
  securityAlertEmail: DS.attr('string'),

  users: DS.hasMany('user', {async:true}),
  invitations: DS.hasMany('invitation', {async:true}),
  roles: DS.hasMany('role', {async:true}),
  securityOfficer: DS.belongsTo('user', {async:true}),
  billingContact: DS.belongsTo('user', {async:true}),

  allowPHI: Ember.computed.match('plan', /production|platform/),

  // needed by aptible-ability
  permitsRole(role, scope){
    return new Ember.RSVP.Promise( (resolve) => {
      let roleOrganizationHref = role.get('data.links.organization');
      let match = orgRegex.exec(roleOrganizationHref);
      let roleOrganizationId = match[1];

      let permitted = roleOrganizationId === this.get('id');
      if (scope === 'manage') {
        permitted = permitted && role.get('privileged');
      }

      resolve(permitted);
    });
  }
});
