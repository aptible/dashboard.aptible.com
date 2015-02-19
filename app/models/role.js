import DS from 'ember-data';

export default DS.Model.extend({
  privileged: DS.attr('boolean'),
  organization: DS.belongsTo('organization', {async: true})
});
