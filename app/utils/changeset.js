import Ember from "ember";

var StagedObject = Ember.Object.extend(Ember.Evented, {

  initialValue() {
    if (this._initialValue === undefined) {
      this._initialValue = this.changeset.initialValue(this.keyData);
    }
    return this._initialValue;
  },

  value() {
    return this._currentValue;
  },

  setValue(value) {
    this._currentValue = value;
    this.trigger('didChange');
    this.changeset.trigger('didChangeStagedObject', this.keyData);
  }

});

export default Ember.Object.extend(Ember.Evented, {

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
    const value = stagedObject.value();
    if (value === undefined) {
      stagedObject.setValue(stagedObject.initialValue());
    }
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

  subscribeAll(callback) {
    this.on('didChangeStagedObject', callback);
  },

  forEachValue(callback) {
    const keys = Ember.keys(this._stagedObjects);
    keys.forEach((key) => {
      let stagedObject = this._stagedObjects[key];
      callback(stagedObject.keyData, stagedObject.initialValue(), stagedObject.value());
    });
  }
});
