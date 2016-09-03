import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(snapshot, options) {
    let data = this._super(snapshot, options);
    let roleHref = snapshot.get('role.data.links.self');

    if(roleHref) {
      data.role = roleHref;
    }

    return data;
  }
});
