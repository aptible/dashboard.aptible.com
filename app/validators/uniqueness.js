import Ember from "ember";
import Base from 'ember-validations/validators/base';
import ajax from '../utils/ajax';

export default Base.extend({
  _validate: function() {
    this.errors.clear();
    return this.call();
  }.on('init'),

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
    if (Ember.isBlank(Ember.get(this.model, this.property))) {
      return Ember.RSVP.resolve(true);
    }

    return new Ember.RSVP.Promise((resolve) => {
      Ember.run.debounce(this, () => {
        this.fetch(resolve);
      }, this._options.debounce);
    });
  },

  fetch(resolve) {
    let options = this._options;
    let errors = this.errors;
    options.data[this.getDataPropertyName()] = this.model.get(this.property);

    return ajax(options.url, Ember.$.extend({}, options)).then(() => {
      resolve(true);
    }, () => {
      errors.clear();
      errors.pushObject(options.message);
      resolve(false);
    });
  }
});
