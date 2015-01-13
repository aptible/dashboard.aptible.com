import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import config from "../config/environment";
import { locationHistory } from '../utils/location';
import FakeServer from "./helpers/fake-server";
import { stubStripe, teardownStripe } from "./helpers/mock-stripe";
import {stubAnalytics, teardownAnalytics} from './helpers/mock-analytics';

setResolver(resolver);

document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});
var containerVisibility = QUnit.urlParams.nocontainer ? 'hidden' : 'visible';
document.getElementById('ember-testing-container').style.visibility = containerVisibility;

QUnit.testStart(function(){
  window.localStorage.setItem(config.authTokenKey, null);
  delete locationHistory.last;
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
