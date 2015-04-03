import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';
import successfulTokenResponse from '../../helpers/successful-token-response';
import {
  signupInputsTest,
  doSignupSteps
} from '../../helpers/shared-tests';

let App;

let orgName = 'Great Co.';
let invitationId     = 'some-invite';
let verificationCode = 'some-verification-code';

let invitationData = {
  id: invitationId,
  organization_name: orgName
};

let userInput = {
  email: 'good@email.com',
  password: 'Correct#Password1!3',
  name: 'Test User'
};

let url = `/signup/invitation/${invitationId}/${verificationCode}`;

module('Acceptance: Signup Invitation', {
  setup: function() {
    App = startApp();
    stubInvitation(invitationData);
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test(`visiting ${url} when logged in redirects`, function(assert) {
  expectRedirectsWhenLoggedIn('/signup');
});

test(`visiting ${url} shows organization name`, function(assert) {
  visit(url);
  andThen(() => {
    assert.ok(find(`:contains(${orgName})`).length,
              `has org name "${orgName}"`);
  });
});

test(`visiting ${url} shows signup inputs`, function(assert) {
  signupInputsTest(url);
});

test(`visiting ${url} shows no organization input`, function(assert) {
  visit(url);
  andThen(() => {
    let orgNameInput = findInput('organization');
    assert.ok(!orgNameInput.length, 'has no org name input');
  });
});

test(`visiting ${url} and signing up redirects to invitation`, function(assert) {
  doSignupSteps(url, userInput);
  andThen(() => {
    assert.equal(currentPath(), 'claim');
    assert.equal(currentURL(), `/claim/${invitationId}/${verificationCode}`);
  });
});

test(`visiting ${url} and signing up with invalid data shows errors`, function(assert) {
  let userInput = {
    name: 'ab', // too short
    password: 'notgood',
    email: 'not-an-email'
  };
  doSignupSteps(url, userInput);
  andThen(() => {
    assert.equal(currentPath(), 'signup.invitation', 'path does not change');
    assert.ok(find(':contains(must contain at least one uppercase)').length,
              'shows password error message');
    assert.ok(find(':contains(is not valid)').length,
              'shows email error message');
    assert.ok(find(':contains(is too short)').length,
              'shows name message');
  });
});
