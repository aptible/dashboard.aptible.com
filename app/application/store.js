import DS from "ember-data";

export default DS.Store.extend({

  findStacksFor(organization) {
    var organizationUrl = organization.get('data.links.self');
    let promise = this.find('stack').then(() => {
      return this.filter('stack', (stack) => {
        return stack.get('data.links.organization') === organizationUrl;
      });
    });

    return DS.PromiseArray.create({ promise });
  },

  recordWasInvalid(internalModel, errors) {
    // TODO: private

    this._super(...arguments);
    if (errors && errors.message) {
      let record = internalModel.getRecord();

      record.get('errors').add('message', errors.message);
    }
  },

  didSaveRecord(internalModel) {
    // TODO: private

    let record = internalModel.getRecord();
    record.get('errors').remove('message');
    return this._super(...arguments);
  }

});
