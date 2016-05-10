import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(snapshot, options) {
    let data = this._super(snapshot, options);
    let otp_href = snapshot.get('currentOtpConfiguration.data.links.self');

    if(otp_href) {
      data.current_otp_configuration = otp_href;
    }

    return data;
  }
});
