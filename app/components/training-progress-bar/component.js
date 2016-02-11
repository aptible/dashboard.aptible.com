import Ember from 'ember';
export const LABEL_VISIBLE_WIDTH = 160;
export default Ember.Component.extend({
  classNames: ['training-progress-bar', 'stacked-bar'],

  totalRequirements: Ember.computed('users.[]', 'users.@each.enrollmentStatus', function() {
    let users = this.get('users').filterBy('settings.isRobot', false);
    let developerCount = users.filterBy('settings.isDeveloper', true).get('length');
    let securityCount = users.filterBy('settings.isSecurityOfficer', true).get('length');

    return users.get('length') + developerCount + securityCount;
  }),

  completedCounts: Ember.computed.mapBy('users', 'completedCourses.length'),
  totalCompleted: Ember.computed.sum('completedCounts'),

  expiredCounts: Ember.computed.mapBy('users', 'expiredCourses.length'),
  totalExpired: Ember.computed.sum('expiredCounts'),

  overdueCounts: Ember.computed.mapBy('users', 'overdueCourses.length'),
  totalOverdue: Ember.computed.sum('overdueCounts'),

  completedWidth: Ember.computed('totalCompleted', 'totalRequirements', function() {
    let { totalCompleted, totalRequirements } = this.getProperties('totalCompleted', 'totalRequirements');

    if (totalCompleted === 0) {
      return 0;
    }

    return totalCompleted/totalRequirements*100;
  }),

  expiredWidth: Ember.computed('totalExpired', 'totalRequirements', function() {
    let { totalExpired, totalRequirements } = this.getProperties('totalExpired', 'totalRequirements');

    if (totalExpired === 0) {
      return 0;
    }

    return totalExpired/totalRequirements*100;
  }),

  overdueMargin: Ember.computed('expireWidth', 'completedWidth', function() {
    return this.get('expiredWidth') + this.get('completedWidth');
  }),

  didRender() {
    this._super(...arguments);
    this.$('.column').each((index, column) => {
      let $column = $(column);
      let showLabel = $column.width() >= LABEL_VISIBLE_WIDTH;

      $column.toggleClass('show-label', showLabel)
    });
  }
});
