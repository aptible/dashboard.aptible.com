import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import config from "../config/environment";
import FakeServer from 'ember-cli-fake-server';
import MockStripe from './helpers/mock-stripe';
import MockAnalytics from './helpers/mock-analytics';
import storage from '../utils/storage';
import MockLocation from './helpers/mock-location';
import MockTitle from './helpers/mock-title';
import './helpers/authentication';
import Cookies from 'ember-cli-aptible-shared/utils/cookies';
import { AFTER_AUTH_COOKIE } from '../app';

setResolver(resolver);

QUnit.testStart(function(){
  storage.remove(config.authTokenKey);

  MockLocation.setup();
  MockTitle.setup();
  MockStripe.setup();
  MockAnalytics.setup();

  FakeServer.start();
});

QUnit.testDone(function(){

  Cookies.erase(AFTER_AUTH_COOKIE);
  Error.stackTraceLimit = 999;

  MockLocation.teardown();
  MockTitle.teardown();
  MockStripe.teardown();
  MockAnalytics.teardown();

  FakeServer.stop();
});
