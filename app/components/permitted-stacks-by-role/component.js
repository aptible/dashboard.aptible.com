import Ember from 'ember';

export default Ember.Component.extend({
  stacksString: function() {
    let stacks = this.get('permittedStacks') || [];
    return stacks.map((s) => s.get('handle')).join(', ');
  }.property('permittedStacks'),
  updatePermittedStacks: function() {
    const role = this.get('role');
    const scope = this.get('scope');
    return Ember.RSVP.all(this.get('stacks').map((stack) => {
      return stack.permitsRole(role, scope).then((permitted) => {
        return permitted && stack;
      });
    })).then((stacks) => {
      const permittedStacks = stacks.filter(r => !!r);
      this.set('permittedStacks', permittedStacks);
    });
  }.observes('scope', 'stacks.[]', 'role.privileged').on('init')
});
