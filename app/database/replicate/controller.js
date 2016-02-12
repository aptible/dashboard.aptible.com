import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Controller.extend({
  supportPortal: config.externalUrls.supportPortal
});
