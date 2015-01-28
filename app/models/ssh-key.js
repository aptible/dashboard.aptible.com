import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  sshPublicKey: DS.attr('string'),
  publicKeyFingerprint: DS.attr('string'),

  user: DS.belongsTo('user', {async:true})
});
