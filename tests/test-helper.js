import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import config from "../config/environment";
import FakeServer from "./helpers/fake-server";
import { stubStripe, teardownStripe } from "./helpers/mock-stripe";
import {stubAnalytics, teardownAnalytics} from './helpers/mock-analytics';
import storage from 'diesel/utils/storage';
import MockLocation from './helpers/mock-location';
import MockTitle from './helpers/mock-title';

setResolver(resolver);

QUnit.testStart(function(){
  storage.remove(config.authTokenKey);
  MockLocation.setup();
  MockTitle.setup();

  stubAnalytics();
  FakeServer.start();
  stubStripe();
});

QUnit.testDone(function(){
  MockLocation.teardown();
  MockTitle.teardown();

  teardownStripe();
  FakeServer.stop();
  teardownAnalytics();
});
