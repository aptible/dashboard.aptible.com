import Ember from 'ember';

const RENEW_TIMEOUT = 1000 * 60 * 5; // 5 minutes
const PROVISION_TIMEOUT = 1000 * 60 * 10; // 10 minutes

export default Ember.Component.extend({
  store: Ember.inject.service(),
  flashMessages: Ember.inject.service(),

  actionLabel: "I Created The CNAME",
  isRenewing: false,

  actions: {
    renew() {
      const vhost = this.get("vhost");

      this.get('store').createRecord('operation', {
        type: 'renew',
        vhost: vhost
      }).save().then((operation) => {
        this.set('isRenewing', true);
        return operation;
      }).then((operation) => {
        return operation.reloadUntilStatusChanged(RENEW_TIMEOUT);
      }).then(() => {
        const m = "Certificate generation succeeded; Aptible will finalize " +
                  "your endpoint set up momentarily.";
        this.get("flashMessages").success(m);

        // Once the renew operation completes, we'll have to wait for a
        // provision operation to complete to deploy the cert. Let's find it
        // and wait for that one.
        return vhost.reload().then((vhost) => {
          return vhost.get("operations");
        }).then((operations) => {
          const provisionOperation = operations.find((operation) => {
            return operation.get("type") === "provision";
          });

          if (!provisionOperation) {
            throw new Error("Found no provision operation!");
          }

          const infoMessage = "Your endpoint is ready.";

          if (provisionOperation.get("isDone")) {
            // If the operation already succeeded, we're done.
            this.get("flashMessages").success(infoMessage);
            return vhost.reload();
          }

          return provisionOperation.reloadUntilStatusChanged(PROVISION_TIMEOUT).then(() => {
            // Otherwise, let's wait until it completes.
            this.get("flashMessages").success(infoMessage);
            return vhost.reload();
          });
        });
      }).catch((e) => {
        // Default to a generic error message, but be more specific if an
        // operation is attached.
        let errorMessage = `An unexpected error occurred: ${e.message}`;

        if (e.operation && e.operation.get("status") === "failed") {
          if (e.operation.get("type") === "renew") {
            errorMessage = "Failed to generate certificate. Please verify the CNAME " +
                           "is set up correctly, and try again in a few minutes.";
          }
          if (e.operation.get("type") === "provision") {
            errorMessage = "Failed to install certificate. Please try again.";
          }
        }

        this.get("flashMessages").danger(errorMessage);
      }).finally(() => {
        // We need to be a little careful here: if our renewal succeeds, this
        // component is going to get torn down, and setting isRenewing back to
        // false could throw an exception.
        if (!(this.get('isDestroyed') || this.get('isDestroying'))) {
          this.set('isRenewing', false);
        }
      });
    }
  }
});
