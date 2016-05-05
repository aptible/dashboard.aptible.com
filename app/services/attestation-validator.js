import Ember from 'ember';

export default Ember.Service.extend({
  validate(attestation, schemaDocument) {
    let validator = this.validators[attestation.get('handle')] || this.validators.global;
    return validator(schemaDocument);
  },

  validators: {
    global() {
      return [];
    },

    workforce_locations() {
      return [];
    },

    workforce_roles(schemaDocument) {
      // TODO: Can this type of validation be done using JSON schema?
      // May have to inverse schema so developers and security officers are
      // arrays.
      let errors = [];

      if (schemaDocument.filterBy('isDeveloper', true).length === 0) {
        errors.push('at least one Developer is required');
      }

      if (schemaDocument.filterBy('isSecurityOfficer', true).length === 0) {
        errors.push('at least one Security Officer is required');
      }

      return errors;
    }
  }
});
