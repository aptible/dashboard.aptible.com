import RavenService from 'ember-cli-sentry/services/raven';

export default RavenService.extend({
  captureException: function(error, options = { throwWhenNotUsable: true }) {
    if (this.get('isRavenUsable')) {
      window.Raven.captureException(...arguments);
    } else if(options.throwWhenNotUsable){
      throw error;
    }
  }
});
