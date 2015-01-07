import Ember from 'ember';

export default Ember.Component.extend({
  selectedDbType: null,

  selectCallback: function(){
    var component = this;

    return function(dbType){
      component.set('selectedDbType', dbType);
      component.sendAction('action', dbType.value);
    };
  }.property(),

  dbTypes: [
    { value: 'postgresql', imageSrc: '/assets/images/db-logos/postgres.png', title: 'PostgreSQL'},
    { value: 'mongodb', imageSrc: '/assets/images/db-logos/mongo.png', title: 'MongoDB'},
    { value: 'redis', imageSrc: '/assets/images/db-logos/redis.png', title: 'Redis'},
    { value: 'mysql', imageSrc: '/assets/images/db-logos/mysql.png', title: 'MySQL'},
    { value: 'couchdb', imageSrc: '/assets/images/db-logos/couchdb.png', title: 'CouchDB'},
    { value: 'elasticsearch', imageSrc: '/assets/images/db-logos/elasticsearch.png', title: 'Elastic Search'}
  ]
});
