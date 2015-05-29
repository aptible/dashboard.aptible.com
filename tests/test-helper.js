import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import config from "../config/environment";
import FakeServer from "ember-cli-fake-server";
import storage from 'sheriff/utils/storage';

setResolver(resolver);

QUnit.testStart(function(){
  storage.remove(config.authTokenKey);
  FakeServer.start();
});

QUnit.testDone(function(){
  FakeServer.stop();
});
