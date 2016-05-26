import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return {
      riskAssessments: [
        {
          id: 10,
          approved_by: [],
          contributors: [
            { name:'Gib Reimschussel', email: 'gib@aptible.com' },
            { name:'Skylar Anderson', email: 'skylar@aptible.com' }
          ],
          created: 'May 2, 2016',
          status: 'draft'
        },
        {
          id: 8,
          approved_by: [{ email: 'chas@aptible.com' }],
          contributors: [
            { name:'Gib Reimschussel', email: 'gib@aptible.com' },
            { name:'Skylar Anderson', email: 'skylar@aptible.com' }
          ],
          created: 'Mar 17, 2016',
          status: 'current'
        },
        {
          id: 5,
          approved_by: [{ email: 'chas@aptible.com' }],
          contributors: [
            { name:'Gib Reimschussel', email: 'gib@aptible.com' },
            { name:'Skylar Anderson', email: 'skylar@aptible.com' }
          ],
          created: 'Feb 4, 2016',
          status: 'archived'
        },
        {
          id: 2,
          approved_by: [{ email: 'chas@aptible.com' }],
          contributors: [
            { name:'Gib Reimschussel', email: 'gib@aptible.com' },
            { name:'Skylar Anderson', email: 'skylar@aptible.com' }
          ],
          created: 'Nov 22, 2015',
          status: 'archived'
        }
      ]
    };
  }
});
