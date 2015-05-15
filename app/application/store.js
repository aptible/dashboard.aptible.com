import DS from "ember-data";

export default DS.Store.extend({

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