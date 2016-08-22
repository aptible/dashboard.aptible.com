var serializedPrefix = '_object:';

let NativeAdapter = function(){
  this.getItem = (key) => window.localStorage.getItem(key);
  this.setItem = (key, val) => window.localStorage.setItem(key, val);
  this.removeItem = (val) => window.localStorage.removeItem(val);
};

let MemoryAdapter = function(){
  let storage = {};
  this.getItem = (key) => storage[key];
  this.setItem = (key, val) => storage[key] = val;
  this.removeItem = (val) => delete storage[val];
};

function checkLocalStorage(){
  try {
    window.localStorage.setItem('test',true);
    window.localStorage.removeItem('test');
    return true;
  } catch(e) {
    return false;
  }
}

let adapter;
if (checkLocalStorage()) {
  adapter = new NativeAdapter();
} else {
  adapter = new MemoryAdapter();
}

export function write(key, value) {
  var serialized;
  if (typeof value === 'object') {
    serialized = serializedPrefix+JSON.stringify(value);
  } else {
    serialized = value;
  }
  return adapter.setItem(key, serialized);
}

export function read(key) {
  var serialized = adapter.getItem(key);
  var value;
  if (typeof serialized === 'string' && serialized.indexOf(serializedPrefix) === 0){
    value = JSON.parse(serialized.slice(8));
  } else {
    value = serialized;
  }
  return value;
}

export function remove(key) {
  return adapter.removeItem(key);
}

export default {
  write:  write,
  read:   read,
  remove: remove
};
