import Ember from "ember";
import Base from 'ember-validations/validators/base';
import ajax from '../utils/ajax';

export default Base.extend({
  setupOptions: function() {
    if(this.options === true) {
      this.options = {};
    }

    let options = Ember.$.extend({
      message: 'is taken.',
      debounce: 150,
      type: 'post',
      data: {},
    }, this.options);

    this._options = options;
  }.on('init'),

  getDataPropertyName() {
    return this.options.paramName || this.property.replace('model.', '');
  },

  call() {
    if (!Ember.isBlank(Ember.get(this.model, this.property))) {
      return Ember.run.debounce(this, this.fetch, this._options.debounce);
    }
  },

  fetch() {
    let options = this._options;
    let errors = this.errors;
    options.data[this.getDataPropertyName()] = this.model.get(this.property);

    if(errors === null) {
      debugger;
    }

    return ajax(options.url, Ember.$.extend({}, options)).then(() => {
    }, () => {
      errors.pushObject(options.message);
    });
  }
});
