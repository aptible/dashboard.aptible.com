import Ember from 'ember';
import ajax from 'diesel/utils/ajax';
import config from 'diesel/config/environment';

function errorToMessage(e) {
  switch(e.status) {
    case 0:
      return "Metrics server is unavailable; please try again later";
    case 400:
      return "Metrics server declined to serve the request";
    case 404:
      return "No data available; please try again later or contact support if this condition persists";
    case 500:
      return "Metrics server is unavailable; please try again later";
    default:
      return "An unknown error occured";
  }
}

export default Ember.Service.extend({
  session: Ember.inject.service(),

  fetchMetrics(containers, horizon, metric) {
    let accessToken = this.get("session.token.accessToken");
    let containerIds = containers.map((container) => container.get("id"));

    return ajax(`${config.metricsBaseuri}/proxy/${containerIds.join(":")}?horizon=${horizon}&metric=${metric}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    .catch((e) => {
      throw new Error(errorToMessage(e));
    });
  }
});
