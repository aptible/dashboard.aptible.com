import { getUrlParameter } from '../utils/url-parameters';
import { replaceLocation } from '../utils/location';

export function initialize(container, application) {
  application.deferReadiness();

  var verificationCode = getUrlParameter(window.location, 'verification_code');
  var invitationId = getUrlParameter(window.location, 'invitation_id');
  var resetCode = getUrlParameter(window.location, 'reset_code');
  var userId = getUrlParameter(window.location, 'user_id');
  if (resetCode) {
    replaceLocation(`/password/new/${resetCode}/${userId}`);
  } else if (invitationId) {
    replaceLocation(`/claim/${invitationId}/${verificationCode}`);
  } else if (verificationCode) {
    replaceLocation(`/verify/${verificationCode}`);
  } else {
    application.advanceReadiness();
  }
}

export default {
  name: 'reroute-verification-code',
  initialize: initialize
};
