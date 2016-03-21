import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  on: 'click',
  placement: 'bottom',
  classNames: ['learn-more-tooltip'],
  hrefTarget: '_blank',
  learnMoreText: 'Learn More',
  content: Ember.computed('tooltip.content', 'tooltip.learnMore', function() {
    let tip = this.get('tip');
    let learnMoreText = this.get('learnMoreText');
    let target = this.get('hrefTarget');
    let { content, learnMore } = tip;

    if (learnMore) {
      learnMore = `<a class="learn-more-link" href="${learnMore}" target="${target}">
                    ${learnMoreText}
                  </a>`;
    }

    return `<div class="learn-more-tooltip-wrapper">
              <div class="learn-more-content">${content}</div>
              <div class="learn-more-cta">${learnMore}</div>
            </div>`;
  })
});