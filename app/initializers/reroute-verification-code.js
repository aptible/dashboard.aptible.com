import { getUrlParameter } from '../utils/url-parameters';
import { replaceLocation } from '../utils/location';

export function initialize(container, application) {
  application.deferReadiness();

  var verificationCode = getUrlParameter(window.location, 'verification_code');
  var invitationId = getUrlParameter(window.location, 'invitation_id');
  if (verificationCode) {
    if (invitationId) {
      replaceLocation(`/claim/${invitationId}/${verificationCode}`);
    } else {
      replaceLocation(`/verify/${verificationCode}`);
    }
  } else {
    application.advanceReadiness();
  }
}

export default {
  name: 'reroute-verification-code',
  initialize: initialize
};
