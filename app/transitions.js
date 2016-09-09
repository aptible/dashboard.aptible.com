const DEFAULT_DURATION = 250;
const DEFAULT_EASING = 'easeInOut';

export default function() {
  let coreRoutes = ['stack', 'apps', 'databases', 'log-drains', 'certificates',
                    'stack.loading', 'app', 'database', 'organization.members',
                    'organization.admin', 'organization.roles', 'settings.profile',
                    'organization.pending-invitations',
                    'settings.ssh', 'settings.impersonate', 'organization.admin.environments',
                    'organization.admin.contact-settings', 'organization.admin.billing'];
  this.transition(
    this.hasClass('click-to-reveal'),
    this.use('crossFade')
  );

  this.transition(
    this.outletName('sidebar'),
    this.use('toLeft', { duration: DEFAULT_DURATION, easing: DEFAULT_EASING })
  );

  this.transition(
    this.fromRoute(coreRoutes),
    //this.fromRoute((r) => console.log("FROM: " + r)),
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
