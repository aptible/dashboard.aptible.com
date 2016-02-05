import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    id: { serialize: false }
  },

  serialize(snapshot, options) {
    // REVIEW: Gridiron controllers consistently look for `organization` param to
    // be a URL to the org.  The model attribute, however, is stored as
    // `organization_url`.  This custom serializer fixes that.

    let json = this._super(snapshot, options);
    json.organization = snapshot.get('organizationUrl');
    return json;
  }
});