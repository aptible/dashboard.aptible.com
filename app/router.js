
import Ember from "ember";
import config from "./config/environment";

function spdSteps() {
  this.modal('add-location-modal', {
    withParams: ['newLocation'],
    otherParams: ['document', 'schema', 'newLocation', 'locationProperty'],
    dismissWithOutsideClick: false
  });

  this.modal('invite-team-modal', {
    withParams: ['showInviteModal'],
    otherParams: ['organization', 'roles', 'schemaDocument'],
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
  location: config.locationType,
  onTransition: function() {
    this.get('analytics').page();

    if(config.flashMessageDefaults.sticky) {
      this.get('flashMessages').clearMessages();
    }
  }.on('didTransition')
});

Router.map(function() {
  this.authenticatedRoute("dashboard", { path: '/' }, function() {

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
      this.route("replicate");
      this.route("cluster");
      this.route("metrics");
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
        this.route("edit", {path: ":user_id/edit"});
      });
      this.route("roles", {}, function() {
        this.route('new');
        this.route("show", {path: ":role_id"});
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

    this.route('settings', {
      resetNamespace: true
    }, function(){
      this.route('admin');
      this.route('profile');
      this.route('ssh');
      this.route('impersonate');
    });
  });

  this.authenticatedRoute("welcome", {
    resetNamespace: true
  }, function() {
    this.route("first-app");
    this.route("payment-info");
  });

  this.route("login");
  this.route("logout");
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

  this.authenticatedRoute('compliance', { path: '/compliance' }, function() {
    this.route('compliance-organization', { path: '/:organization_id', resetNamespace: true }, function() {
      this.route("engines", { path: '', resetNamespace: true }, function() {

        this.route("training", { path: '/training', resetNamespace: true }, function() {
          this.route("criterion", { path: ':criterion_handle' }, function() {});
        });

        this.route('risk');
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
