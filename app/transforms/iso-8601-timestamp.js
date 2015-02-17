import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize: function(serialized) {
    if (serialized) {
      return new Date(serialized);
    }
  },

  serialize: function(deserialized) {
    if (deserialized) {
      return deserialized.toISOString();
    }
  }
});
