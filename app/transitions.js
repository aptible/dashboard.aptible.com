const DEFAULT_DURATION = 250;
const DEFAULT_EASING = 'easeInOut';

export default function() {
  this.transition(
    this.outletName('sidebar'),
    this.use('toLeft', { duration: DEFAULT_DURATION, easing: DEFAULT_EASING })
  );

  this.transition(
    this.fromRoute(['stack', 'apps', 'databases', 'log-drains', 'certificates', 'stack.loading', 'app', 'database']),
    this.use('fade')
  );

  this.transition(
    this.inHelper('liquid-modal'),
    this.use('fade', { duration: DEFAULT_DURATION, easing: DEFAULT_EASING })
  );

  this.transition(
    this.hasClass('fadeIn'),
    this.use('fade', { duration: DEFAULT_DURATION, easing: DEFAULT_EASING })
  );
}
