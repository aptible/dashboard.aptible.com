import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';
import { AFTER_AUTH_COOKIE } from 'diesel/login/route';
import Cookies from "diesel/utils/cookies";
import {
  signupInputsTest,
  doSignupSteps
} from '../../helpers/shared-tests';

let App;

let orgName = 'Great Co.';
let invitationId     = 'some-invite';
let verificationCode = 'some-verification-code';
let claimUrl = '/claims/user';
let userInput = {
  email: 'good@email.com',
  password: 'Correct#Password1!3',
  name: 'Test User'
};

let invitationData = {
  id: invitationId,
  organization_name: orgName,
  email: userInput.email,
  inviter_name: 'Houdini'
};

let url = `/signup/invitation/${invitationId}/${verificationCode}`;

module('Acceptance: Signup Invitation', {
  beforeEach: function() {
    App = startApp();
    stubInvitation(invitationData);
    stubRequest('post', claimUrl, function() {
      return [204, {}, ''];
    });
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test(`visiting ${url} when logged in redirects`, function() {
  expectRedirectsWhenLoggedIn('/signup');
});

test(`visiting ${url} shows organization name`, function(assert) {
  visit(url);
  andThen(() => {
    assert.ok(find(`:contains(${invitationData.organization_name})`).length,
              `has org name "${invitationData.organization_name}"`);
  });
});

test(`visiting ${url} shows inviter name`, function(assert) {
  visit(url);
  andThen(() => {
    assert.ok(find(`:contains(${invitationData.inviter_name})`).length,
              `has inviter name "${invitationData.inviter_name}"`);
  });
});

test(`visiting ${url} shows signup inputs`, function() {
  signupInputsTest(url);
});

test(`visiting ${url} pre-fills user's email from invitation`, function(){
  visit(url);
  andThen(() => {
    expectInput('email', {value: invitationData.email});
  });
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

test(`visiting ${url} sets afterAuthUrl cookie`, function(assert) {
  let claimUrl = `/claim/${invitationId}/${verificationCode}`;
  visit(url);

  andThen(() => {
    assert.equal(Cookies.read(AFTER_AUTH_COOKIE), claimUrl);
  });
});
