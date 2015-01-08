var serializedPrefix = '_object:';

export function write(key, value) {
  var serialized;
  if (typeof value === 'object') {
    serialized = serializedPrefix+JSON.stringify(value);
  } else {
    serialized = value;
  }
  return window.localStorage.setItem(key, serialized);
}

export function read(key) {
  var serialized = window.localStorage.getItem(key);
  var value;
  if (typeof serialized === 'string' && serialized.indexOf(serializedPrefix) === 0){
    value = JSON.parse(serialized.slice(8));
  } else {
    value = serialized;
  }
  return value;
}

export function remove(key) {
  return window.localStorage.removeItem(key);
}

export default {
  write:  write,
  read:   read,
  remove: remove
};
