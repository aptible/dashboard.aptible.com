import Ember from "ember";
import Base from 'ember-validations/validators/base';
import ajax from "../utils/ajax";

// Note: this.model here refers to the parent controller that instantiated this
// validator. https://github.com/dockyard/ember-validations/blob/master/addon/mixin.js#L119

export default Base.extend({
  _validate: Ember.on('init', function() {
    return this.call();
  }),

  setupOptions: Ember.on('init', function() {
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
  }),

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
    let model = this.model.get('model'); // See note above

    options.data[this.getDataPropertyName()] = this.model.get(this.property);

    if(model) {
      Ember.set(model, 'isValidating', true);
    }

    return ajax(options.url, Ember.$.extend({}, options)).then(() => {
      errors.clear();
      resolve(true);
    }, () => {
      errors.clear();
      errors.pushObject(options.message);
      resolve(false);
    }).finally(() => {
      if(model) {
        Ember.set(model, 'isValidating', false);
      }
    });
  }
});