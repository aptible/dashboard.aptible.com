export function write(key, value) {
  return window.localStorage.setItem(key, value);
}

export function read(key) {
  return window.localStorage.getItem(key);
}

export function remove(key) {
  return window.localStorage.removeItem(key);
}

export default {
  write:  write,
  read:   read,
  remove: remove
};
