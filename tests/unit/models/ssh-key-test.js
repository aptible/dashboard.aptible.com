import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from "../../helpers/fake-server";
import Ember from 'ember';

moduleForModel('ssh-key', 'SshKey', {
  // Specify the other units that are required for this test.
  needs: [
    'model:role',
    'model:organization',
    'model:user',
    'model:token',

    'adapter:application',
    'adapter:ssh-key',
    'adapter:user',
    'serializer:application',
  ]
});

/*
 * There is a bug in the interaction between ember data and the
 * isolated container used in `moduleForModel` unit tests
 * that causes issues unit-testing this ssh-key model.
 * The store will end up incorrectly unable to find the model
 * when it calls `modelFor('sshKey')`.
 * More details are here: https://github.com/bantic/data/pull/1
 *
 * There should be tests here that POSTing and DELETEing ssh keys
 * use the correct urls (/users/:user_id/ssh_keys and /ssh_keys/:ssh_key_id
 * for the latter, respectively).
 */
