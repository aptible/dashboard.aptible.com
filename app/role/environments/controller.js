import Ember from "ember";

export default Ember.Controller.extend({
  _changesetIsChanged: false,

  observeChangeset: function() {
    this._super.apply(this, arguments);
    this.get('changeset').subscribeAll(() => {
      let hasChanged = false;
      this.get('changeset').forEachValue((keyData, initialValue, value) => {
        if (!hasChanged && initialValue.isEnabled !== value.isEnabled) {
          hasChanged = true;
        }
      });

      this.set('_changesetIsChanged', hasChanged);
    });
  }
});
