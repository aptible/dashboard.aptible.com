import Ember from "ember";
import config from "./config/environment";

const RISK_ASSESSMENT_COMPONENTS = ["threat_events", "predisposing_conditions",
                                    "security_controls", "threat_sources",
                                    "vulnerabilities"];

let inflector = new Ember.Inflector(Ember.Inflector.defaultRules);

function spdSteps() {
  this.modal('add-location-modal', {
    withParams: ['newLocation'],
    otherParams: ['document', 'schema', 'newLocation', 'locationProperty'],
    dismissWithOutsideClick: false
  });

  this.modal('invite-team-modal', {
    withParams: ['addUsersToRole'],
    otherParams: ['organization', 'roles'],
    dismissWithOutsideClick: false,
    actions: {
      inviteTeam: 'inviteTeam'
    }
  });

  this.route('organization');
  this.route('locations');
  this.route('team');
  this.route('data-environments');
  this.route('security-controls', {}, function() {
    this.route('show', { path: ':handle' });
  });
}

const Router = Ember.Router.extend({
  analytics: Ember.inject.service(),
  elevation: Ember.inject.service(),
  location: config.locationType,

  onBeforeTransition: function(transition) {
    // TODO: Can this be added to the requires-elevation route instead?
    return this.get("elevation").tryDropPrivileges(transition);
  }.on('willTransition'),

  onTransition: function() {
    this.get('analytics').page();

    if(config.flashMessageDefaults.sticky) {
      this.get('flashMessages').clearMessages();
    }
  }.on('didTransition')
});

Router.map(function() {
  this.authenticatedRoute("dashboard", { path: '/' }, function() {
    this.route('catch-redirects', { path: '', resetNamespace: true }, function() {
      this.route("index", { path: '', resetNamespace: true });

      this.route("app", {
        resetNamespace: true,
        path: "apps/:app_id"
      }, function() {
        this.route("services", function () {
          this.route('metrics', {
            path: ':service_id/metrics'
          });
        });
        this.route("vhosts", {}, function(){
          this.route('new');
          this.route('edit', {
            path: ':vhost_id/edit'
          });
        });
        this.route("activity");
        this.route("deprovision");
        this.route("deploy");
      });

      this.route("database", {
        resetNamespace: true,
        path: "databases/:database_id"
      }, function() {
        this.route("activity");
        this.route("metrics");
        this.route("backups");
        this.route("replicate");
        this.route("cluster");
        this.route("deprovision");
      });

      this.route("stack", {
        resetNamespace: true,
        path: "stacks/:stack_id"
      }, function() {
        this.route("activate", { path: 'activate'});
        this.route("log-drains", {
          path: 'logging'
        }, function(){
          this.route("new");
        });

        this.route("apps", {
          resetNamespace: true
        }, function() {
          this.route("new");
        });

        this.route("databases", {
          resetNamespace: true
        }, function() {
          this.route("new");
        });

        this.route("certificates", {
          resetNamespace: true
        }, function() {
          this.route("new");
          this.route('edit', {
            path: ':certificate_id/edit'
          });
        });
      });

      this.route("stacks", { resetNamespace: true });

      this.route("organization", {
        resetNamespace: true,
        path: "/organizations/:organization_id"
      }, function() {
        this.route("members", {}, function() {
          this.route('pending-invitations');
          this.route("edit", {path: ":user_id/edit"});
        });
        this.route("roles", {}, function() {
          this.route("platform");
          this.route("compliance");
          this.route('new');
        });
        this.route("invite");
        this.route('contact-settings');
        this.route('environments', function() {
          this.route('new');
        });
        this.route("billing", {}, function() {
          this.route('plan');
          this.route('payment-method');
        });
      });

      this.route("role", {
        resetNamespace: true,
        path: "roles/:role_id"
      }, function() {
        this.route('members');
        this.route('environments');
        this.route('settings');
      });
    });

    this.route('settings', {
      resetNamespace: true
    }, function() {
      this.route('requires-elevation', { path: 'protected' }, function() {
        // REVIEW: We *need* to have a path for this, otherwise the index
        // redirect to profile won't work. Is /protected/ the "right" path?
        this.route('admin');
      });
      this.route('profile');
      this.route('ssh');
      this.route('impersonate');
      this.route('logout');
    });
  });

  this.authenticatedRoute("welcome", {
    path: '/welcome/:organization_id',
    resetNamespace: true
  }, function() {
    this.route("first-app");
    this.route("payment-info");
  });

  this.authenticatedRoute("trainee-dashboard", { resetNamespace: true });
  this.authenticatedRoute("elevate", { resetNamespace: true });
  this.authenticatedRoute("no-organization", { resetNamespace: true });

  this.route("login");
  this.route("signup", {}, function(){
    this.route('invitation', {path:'/invitation/:invitation_id/:verification_code'});
  });
  this.route("password", {}, function(){
    this.route('reset');
    this.route('new', {path: 'new/:reset_code/:user_id'});
  });

  this.authenticatedRoute("verify", {
    path: "verify/:verification_code"
  });

  this.route("claim", {
    path: "claim/:invitation_id/:verification_code"
  });

  this.authenticatedRoute('print-risk-assessment', { path: 'risk_assessments/:risk_assessment_id/print', resetNamespace: true}, function() {});

  this.authenticatedRoute("risk-assessment", { path: 'risk_assessments/:risk_assessment_id', resetNamespace: true}, function() {
    this.route("submit", { path: "submit" });
    this.route("activity", { path: 'activity' });
    this.route("compare", { path: 'compare' });

    RISK_ASSESSMENT_COMPONENTS.forEach((component) => {
      let indexRoute = component.replace('_', '-');
      // Index routes e.g threat_events

      this.route(indexRoute, { path: component, resetNamespace: true }, function() {
        this.route('new');
      });
    });
  });

  // Show routes e.g. threat_events/risk_assessment_id_spear_phishing
  RISK_ASSESSMENT_COMPONENTS.forEach((component) => {
    let indexRoute = component.replace('_', '-');
    let showRoute = inflector.singularize(indexRoute);
    let showPath = `${component}/:id`;

    this.route(showRoute, { path: showPath, resetNamespace: true }, function() {
      this.route('edit');
    });
  });

  this.authenticatedRoute('compliance', { path: '/compliance' }, function() {
    this.route('compliance-organization', { path: '/:organization_id', resetNamespace: true }, function() {
      this.route("engines", { path: '', resetNamespace: true }, function() {

        this.route("training", { path: '/training', resetNamespace: true }, function() {
          this.route("criterion", { path: ':criterion_handle' }, function() {});
        });

        this.route("risk-assessments", { path: 'risk_assessments', resetNamespace: true });

        this.route('policies');
        this.route('security');
        this.route('contracts');
        this.route('incidents');

        this.route('compliance-settings', { path: 'settings', resetNamespace: true }, spdSteps);
      });

      this.route('setup', { path: 'setup', resetNamespace: true}, function() {
        this.route('start');
        this.route('finish');
        spdSteps.call(this);
      });
    });
  });

  this.route('not-found', {path: '/*wildcard'});
});

export default Router;
