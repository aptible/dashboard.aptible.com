import Ember from 'ember';

var types = {
  provision: 'fa-server',
  deploy: 'fa-cloud-upload',
  configure: 'fa-cog',
  scale: 'fa-sliders',
  execute: 'fa-chevron-right',
  rebuild: 'fa-refresh',
  restart: 'fa-refresh',
  tunnel: 'fa-exchange',
  clone: 'fa-copy',
  deprovision: 'fa-remove',
  reprovision: 'fa-refresh',
  replicate: 'fa-clone',
  backup: 'fa-hdd-o'
};

var statuses = {
  queued: 'status-queued',
  running: 'status-running',
  failed: 'status-failed',
  succeeded: 'status-succeeded'
};

export default Ember.Component.extend({
  tagName: 'i',
  classNameBindings: [':fa', 'icon', 'color'],
  attributeBindings: ['title'],

  title: function() {
    return `${this.get('type').capitalize()} ${this.get('status')}`;
  }.property('type', 'status'),

  color: function() {
    return statuses[this.get('status')];
  }.property('status'),

  icon: function() {
    return types[this.get('type')];
  }.property('type')
});
