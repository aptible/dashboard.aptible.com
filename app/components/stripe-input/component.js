import Ember from 'ember';

function handleChangeEvent() {
  let value = this.readDOMAttr('value');
  processValue.call(this, value);
}

function processValue(value) {
  if (this._value !== value) {
    this._value = value;
    this.attrs.update(value);
  }
}

export default Ember.Component.extend({
  tagName: 'input',
  attributeBindings: [ 'type', 'value', 'placeholder', 'data-stripe' ],
  type: 'text',
  _value: undefined,

  input: handleChangeEvent,
  change: handleChangeEvent,

  didReceiveAttrs: function() {
    if (!this.attrs.update) {
      throw new Error('You must provide an `update` action to `{{stripe-input}}`.');
    }

    processValue.call(this, this.get('value'));
  }
});
