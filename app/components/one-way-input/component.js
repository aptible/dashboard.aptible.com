import Ember from 'ember';

function handleChangeEvent() {
  let value = this.readDOMAttr('value');
  processValue.call(this, value);
}

function processValue(rawValue) {
  let value = this.sanitizeInput(rawValue);

  if (this._sanitizedValue !== value) {
    this._sanitizedValue = value;
    this.attrs.update(value);
  }
}

export default Ember.Component.extend({
  tagName: 'input',
  attributeBindings: [ 'type', 'value', 'placeholder', 'data-stripe', 'name' ],
  type: 'text',
  _sanitizedValue: undefined,

  input: handleChangeEvent,
  change: handleChangeEvent,

  sanitizeInput: function(input) {
    return input;
  },

  didReceiveAttrs: function() {
    if (!this.attrs.update) {
      throw new Error(`You must provide an \`update\` action to \`{{${this.templateName}}}\`.`);
    }

    processValue.call(this, this.get('value'));
  }
});
