import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  attrs: {
    isDefault: 'default'
  },

  serialize(snapshot, options) {
    let json = this._super(snapshot, options);
    let cert_href = snapshot.get('certificate.data.links.self');

    if(cert_href) {
      json.certificate = cert_href;
    }

    return json;
  }
});
