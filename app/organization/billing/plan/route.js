import Ember from 'ember';
import { UPGRADE_PLAN_REQUEST_EVENT } from 'diesel/models/organization';

export default Ember.Route.extend({
  analytics: Ember.inject.service(),
  confirmationModal: Ember.inject.service(),

  actions: {
    upgrade(planType) {
      this.get('confirmationModal').open({
        partial: 'confirmation-modals/upgrade-plan',
        onConfirm: () => this._upgradePlan(planType)
      });
    },

    requestUpgrade() {
      this._trackUpgradeRequest();

      this.get('confirmationModal').open({
        partial: 'confirmation-modals/request-plan-upgrade'
      });
    }
  },

  _trackUpgradeRequest() {
      const organization = this.modelFor('organization');
      const eventName = UPGRADE_PLAN_REQUEST_EVENT;
      const eventAttributes = {
        organization_id: organization.get('id'),
        organization_name: organization.get('name')
      };

      this.get('analytics').track(eventName, eventAttributes);
  },

  _upgradePlan(planType) {
    const organization = this.modelFor('organization');
    const controller = this.controller;
    organization.set('plan', planType);

    controller.set('error', null);
    controller.set('isUpgrading', true);
    organization.save().catch((e) => {
      controller.set('error',
                     Ember.get(e, 'responseJSON.message'));
      organization.rollback();
    }).finally(() => {
      controller.set('isUpgrading', false);
    });
  },

});
