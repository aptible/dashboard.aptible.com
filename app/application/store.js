import DS from "ember-data";

export default DS.Store.extend({

  findStacksFor(organization) {
    var organizationUrl = organization.get('data.links.self');
    return this.find('stack').then((stacks) => {
      return this.filter('stack', function(stack) {
        return stack.get('data.links.organization') === organizationUrl;
      });
    });
  },

  recordWasInvalid: function(record, errors) {
    this._super(record, errors);
    if (errors && errors.message) {
      record.get('errors').add('message', errors.message);
    }
  },

  didSaveRecord: function(record, data) {
    record.get('errors').remove('message');
    return this._super(record, data);
  }

});
