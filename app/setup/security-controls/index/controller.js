import Ember from 'ember';

export default Ember.Controller.extend({
  dataEnvironmentGroups: Ember.computed('model.[]', function() {
    return this.get('model').filter((group) => {
      return group.provider !== 'aptible';
    });
  }),

  defaultGroups: Ember.computed.filterBy('model', 'provider', 'aptible')
});
