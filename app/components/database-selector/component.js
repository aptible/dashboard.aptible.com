import Ember from 'ember';

export default Ember.Component.extend({
    databases: null,
    selectedDatabase: null,
    didChange: Ember.observer('selectedDatabase', function() {
        let selectedDatabase = this.get('selectedDatabase');
        if(selectedDatabase) {
            this.sendAction('select', selectedDatabase);
        }
    })
});
