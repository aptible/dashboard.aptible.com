// Need to build a new document from scratch, even if one already exists
// Users can be added/removed at any time, so first loop over all users.
// For each user, determine if a document already exists, if so load that
// document.  If not, create a new blank document
// Return the new schema document

export default function buildTeamDocument(users, documents, schema) {
  let schemaDocument = schema.buildDocument();
  users.forEach((user) => {
    let { name, email } = user.getProperties('name', 'email');
    let href = user.get('data.links.self');
    let document = findUserDocument(documents, href) || {};
    let item = schemaDocument.addItem();

    item.set('name', name);
    item.set('email', email);
    item.set('href', href);

    if(document) {
      let { isDeveloper, isSecurityOfficer, isPrivacyOfficer } = Ember.getProperties(
        document, ['isDeveloper', 'isSecurityOfficer', 'isPrivacyOfficer']
      );

      if(typeof isDeveloper !== 'undefined') {
        item.set('isDeveloper', isDeveloper);
      }

      if(typeof isSecurityOfficer !== 'undefined') {
        item.set('isSecurityOfficer', isSecurityOfficer);
      }

      if(typeof isPrivacyOfficer !== 'undefined') {
        item.set('isPrivacyOfficer', isPrivacyOfficer);
      }

    }
  });

  return schemaDocument;
}

function findUserDocument(documents, href) {
  return documents.find((userDocument) => {
    return Ember.get(userDocument, 'href') === href;
  });
}
