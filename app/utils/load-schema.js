import Schema from 'ember-json-schema-document/models/schema';
import ajax from 'diesel/utils/ajax';
import config from "diesel/config/environment";
import { getAccessToken } from '../adapters/application';

export default function(handle) {
  let options = { headers: { Authorization: `Bearer ${getAccessToken()}` } };
  let schemaRef = `${config.gridironBaseUri}/schemas/${handle}`;

  return Schema.load(schemaRef, options, ajax);
}