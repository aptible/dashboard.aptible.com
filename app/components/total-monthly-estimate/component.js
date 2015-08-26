import Ember from 'ember';

const HOURS_PER_MONTH = 730;

export function getStackTotalCents(stack, billingDetail) {
  let stackTotal = 0;
  let containerTotal = stack.get('containerCount') *
                       billingDetail.get('containerCentsPerHour') *
                       HOURS_PER_MONTH;
  let domainTotal =    stack.get('domainCount') *
                       billingDetail.get('domainCentsPerHour') *
                       HOURS_PER_MONTH;
  let diskTotal =      stack.get('totalDiskSize') *
                       billingDetail.get('diskCentsPerHour') *
                       HOURS_PER_MONTH;
  return containerTotal + domainTotal + diskTotal;
}

export function getStacksTotal(stacks, billingDetail) {
  let totalCents = 0;

  this.get('stacks').forEach((stack) => {
    totalCents += getStackTotalCents(stack, billingDetail);
  });

  return totalCents;
}

export default Ember.Component.extend({
  total: function() {
    let total = getStacksTotal(this.get('stacks'), this.get('billingDetail'));
    return (total / 100).toFixed(2);
  }.volatile()
});
