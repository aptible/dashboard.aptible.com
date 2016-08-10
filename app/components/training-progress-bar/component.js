import Ember from 'ember';
export const LABEL_VISIBLE_WIDTH = 160;

function getWidth(numerator, denominator) {
  if (!numerator) { return 0; }
  return numerator/denominator*100;
}

export default Ember.Component.extend({
  classNames: ['training-progress-bar', 'stacked-bar'],

  totalRequirements: Ember.computed('users.[]', 'users.@each.enrollmentStatus', function() {
    return this.get('complianceStatus.users.length');
  }),

  userStatuses: Ember.computed.alias('complianceStatus.training.userStatuses'),
  completed: Ember.computed.filterBy('userStatuses', 'status', 'complete'),
  expired: Ember.computed.filterBy('userStatuses', 'status', 'expired'),
  overdue: Ember.computed.filterBy('userStatuses', 'status', 'incomplete'),

  completedWidth: Ember.computed('completed.[]', 'totalRequirements', function() {
    let totalCompleted = this.get('completed.length');
    let totalRequirements = this.get('totalRequirements');

    return getWidth(totalCompleted, totalRequirements);
  }),

  expiredWidth: Ember.computed('totalExpired', 'totalRequirements', function() {
    let totalExpired = this.get('expired.length');
    let totalRequirements = this.get('totalRequirements');

    return getWidth(totalExpired, totalRequirements);
  }),

  overdueMargin: Ember.computed('expireWidth', 'completedWidth', function() {
    return this.get('expiredWidth') + this.get('completedWidth');
  }),

  didRender() {
    this._super(...arguments);
    this.$('.column').each((index, column) => {
      let $column = $(column);
      let showLabel = $column.width() >= LABEL_VISIBLE_WIDTH;

      $column.toggleClass('show-label', showLabel);
    });
  }
});
