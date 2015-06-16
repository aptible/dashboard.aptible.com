import {
  moduleFor,
  test
} from 'ember-qunit';

let oldRaven;
let mockRaven = {};

moduleFor('service:sentry', 'SentryService', {
  setup() {
    oldRaven = window.Raven;
    window.Raven = mockRaven;
  },
  teardown() {
    window.Raven = oldRaven;
  }
});

test('it identifies with email', function() {
  expect(1);
  var service = this.subject();
  var email = 'some@email.com';

  mockRaven.setUserContext = function(attributes) {
    equal(attributes.email, email, 'email is passed to context');
  };

  service.identify({ email: email });
});
