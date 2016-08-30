import Ember from 'ember';
import { CREATE_NEW_PRODUCTION_ENVIRONMENT_EVENT } from 'diesel/models/organization';

export default Ember.Route.extend({
  analytics: Ember.inject.service(),
  model() {
    let context = this.modelFor('organization');
    let organization = context.get('organization');
    return this.store.createRecord('stack', { organization });
  },

  setupController(controller, model) {
    let context = this.modelFor('organization');
    let organization = context.get('organization');
    let billingDetail = context.get('billingDetail');
    let allowPHI = false;

    controller.setProperties({ organization, model, billingDetail, allowPHI });
  },

  _trackEnvironmentCreation() {
      let stack = this.currentModel;
      let organization = this.modelFor('organization');
      let eventName = CREATE_NEW_PRODUCTION_ENVIRONMENT_EVENT;
      let eventAttributes = {
        organization_id: organization.get('id'),
        organization_name: organization.get('name'),
        account_id: stack.get('id'),
        account_handle: stack.get('handle')
      };

      this.get('analytics').track(eventName, eventAttributes);
  },

  actions: {
    willTransition() {
      this.currentModel.rollback();
    },

    cancel() {
      this.transitionTo('organization.environments');
    },

    save() {
      let stack = this.currentModel;
      let allowPHI = this.controller.get('allowPHI');

      if (allowPHI) {
        stack.set('type', 'production');
      } else {
        stack.set('type', 'development');
      }

      stack.save().then(() => {
        let message = `${stack.get('handle')} created`;

        if(stack.get('type') === 'production') {
          this._trackEnvironmentCreation();
        }

        this.transitionTo('organization.environments');
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});
