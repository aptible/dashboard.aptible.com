import Ember from "ember";

var StagedObject = Ember.Object.extend(Ember.Evented, {

  initialValue() {
    if (this._initialValue === undefined) {
      this._initialValue = this.changeset.initialValue(this.keyData);
    }
    return this._initialValue;
  },

  value() {
    if (this._currentValue === undefined) {
      this._currentValue = this.initialValue();
    }
    return this._currentValue;
  },

  setValue(value) {
    this._currentValue = value;
    this.trigger('didChange');
  }

});

export default Ember.Object.extend({

  init() {
    this._stagedObjects = Ember.create(null);
    Ember.assert('must define `key` method',
                 typeof this.key === 'function');
    Ember.assert('must define `initialValue` method',
                 typeof this.initialValue === 'function');
  },

  _lookupStagedObject(keyData) {
    let key = this.key(keyData);
    let stagedObject = this._stagedObjects[key];
    if (!stagedObject) {
      stagedObject = StagedObject.create({
        changeset: this,
        keyData
      });
      this._stagedObjects[key] = stagedObject;
    }
    return stagedObject;
  },

  value(keyData) {
    let stagedObject = this._lookupStagedObject(keyData);
    return stagedObject.value();
  },

  setValue(keyData, value) {
    let stagedObject = this._lookupStagedObject(keyData);
    return stagedObject.setValue(value);
  },

  subscribe(keyData, callback) {
    let stagedObject = this._lookupStagedObject(keyData);
    stagedObject.on('didChange', callback);
  },

  forEachValue(callback) {
    const keys = Ember.keys(this._stagedObjects);
    keys.forEach((key) => {
      let stagedObject = this._stagedObjects[key];
      callback(stagedObject.keyData, stagedObject.initialValue(), stagedObject.value());
    });
  },

  forEachChangedValue(callback) {
    this.forEachValue((keyData, initialValue, value) => {
      if (initialValue !== value) {
        callback(keyData, initialValue, value);
      }
    });
  }
});
