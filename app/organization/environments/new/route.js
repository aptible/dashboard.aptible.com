import Ember from 'ember';
import { CREATE_NEW_PRODUCTION_ENVIRONMENT_EVENT } from 'diesel/models/organization';

export default Ember.Route.extend({
  analytics: Ember.inject.service(),
  model() {
    let organization = this.modelFor('organization');
    const billingDetail = this.store.find('billing-detail', organization.get('id'));
    const stack = this.store.createRecord('stack', {
      organization,
      organizationUrl: organization.get('_data.links.self')
    });

    return Ember.RSVP.hash({
      stack: stack,
      billingDetail: billingDetail
    });
  },

  setupController(controller, model) {
    let organization = this.modelFor('organization');
    controller.set('organization', organization);
    controller.set('model', model.stack);
    controller.set('billingDetail', model.billingDetail);
    controller.set('allowPHI', false);
  },

  _trackEnvironmentCreation() {
      let stack = this.currentModel.stack;
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
      this.currentModel.stack.rollback();
    },

    cancel() {
      this.transitionTo('organization.environments');
    },

    save() {
      let stack = this.currentModel.stack;
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
