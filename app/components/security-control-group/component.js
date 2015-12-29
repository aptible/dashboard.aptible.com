import Ember from 'ember';

export default Ember.Component.extend({
 classNames: ['security-control-group'],
 unsortedProperties: Ember.computed.alias('securityControlGroup.schema.properties')
 properties: Ember.computed.sort('unsortedProperties', 'displayProperties.ordinal')
});
