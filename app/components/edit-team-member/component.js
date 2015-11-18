import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [''],
  tagName: 'tr',

  init() {
    this._super(...arguments);
    let teamMemberDocument = this.get('document');

    teamMemberDocument.set('name', this.get('user.name'));
    teamMemberDocument.set('email', this.get('user.email'));
    teamMemberDocument.set('href', this.get('user.data.links.self'));
  },

  actions: {
    toggleDeveloper(value) {
      let teamMemberDocument = this.get('document');
      teamMemberDocument.set('isDeveloper', value);
    },

    toggleSecurityOfficer(value) {
      let teamMemberDocument = this.get('document');
      teamMemberDocument.set('isSecurityOfficer', value);
    },

    togglePrivacyOfficer(value) {
      let teamMemberDocument = this.get('document');
      teamMemberDocument.set('isPrivacyOfficer', value);
    }
  }
});
