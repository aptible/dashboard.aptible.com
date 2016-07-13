import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let application;
let orgId = 1;
let url = `/organizations/${orgId}/roles`;
let rolesUrl = url;

module('Acceptance: Role Settings', {
});
