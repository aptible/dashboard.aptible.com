export default function assertHasElement(selector, message) {
  let found = find(selector);
  if (!found.length) {
    message = message || `No element found for "${selector}"`;
    this.push(false, false, true, message);
  } else {
    message = message || `Found "${selector}"`;
    this.push(true, true, true, message);
  }
}
