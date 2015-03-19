import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import config from "../config/environment";
import { locationHistory } from '../utils/location';
import { titleHistory } from '../utils/title-route-extensions';
import FakeServer from "./helpers/fake-server";
import { stubStripe, teardownStripe } from "./helpers/mock-stripe";
import {stubAnalytics, teardownAnalytics} from './helpers/mock-analytics';
import storage from 'diesel/utils/storage';

setResolver(resolver);

QUnit.testStart(function(){
  storage.remove(config.authTokenKey);
  delete locationHistory.last;
  delete titleHistory.last;
});

QUnit.testStart(function(){
  stubAnalytics();
  FakeServer.start();
  stubStripe();
});

QUnit.testDone(function(){
  teardownStripe();
  FakeServer.stop();
  teardownAnalytics();
});
