import Ember from 'ember';

export default Ember.Component.extend({
  // classNameBindings: [':operation-item'],
  content: Ember.computed("backup.copiedFrom", "backup.database", function() {
    // TODO: Link to CLI install instructions?
    // Restoring from a copy is equivalent to restoring from the original,
    // except it's slower, so we offer the original's ID if there's one.
    const restoreId = this.get("backup.copiedFrom.id") || this.get("backup.id");
    const bits = [];
    bits.push('<p>Use the Aptible CLI to restore this backup to a new database:</p>');
    bits.push(`<p><code>aptible backup:restore ${restoreId}</code></p>`);
    return bits.join(" ");
  })
});
