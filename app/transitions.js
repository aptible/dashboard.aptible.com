import config from 'diesel/config/environment';
const DEFAULT_EASING = 'easeInOut';

export default function() {
  let coreRoutes = ['stack', 'apps', 'databases', 'log-drains', 'certificates',
                    'stack.loading', 'app', 'database', 'organization.members',
                    'organization.admin', 'organization.roles', 'settings.profile',
                    'organization.pending-invitations',
                    'settings.ssh', 'settings.impersonate', 'organization.admin.environments',
                    'organization.admin.contact-settings', 'organization.admin.billing',
                    'threat-sources', 'threat-events', 'vulnerabilities', 'predisposing-conditions', 'security-controls'];
  this.transition(
    this.hasClass('click-to-reveal'),
    this.use('crossFade')
  );

  this.transition(
    this.outletName('sidebar'),
    this.use('toLeft', { duration: config.transitionDuration, easing: DEFAULT_EASING })
  );

  this.transition(
    this.fromRoute(coreRoutes),
    this.use('crossFade')
  );

  this.transition(
    this.withinRoute('risk-assessment'),
    this.use('crossFade')
  );

  this.transition(
    this.inHelper('liquid-modal'),
    this.use('crossFade', { duration: config.transitionDuration, easing: DEFAULT_EASING })
  );

  this.transition(
    this.hasClass('fadeIn'),
    this.use('crossFade', { duration: config.transitionDuration, easing: DEFAULT_EASING })
  );
}
