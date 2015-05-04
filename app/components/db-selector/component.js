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
    { value: 'postgresql', imageSrc: '/images/db-logos/postgres.png', title: 'PostgreSQL'},
    { value: 'mongodb', imageSrc: '/images/db-logos/mongo.png', title: 'MongoDB'},
    { value: 'redis', imageSrc: '/images/db-logos/redis.png', title: 'Redis'},
    { value: 'mysql', imageSrc: '/images/db-logos/mysql.png', title: 'MySQL'},
    { value: 'couchdb', imageSrc: '/images/db-logos/couchdb.png', title: 'CouchDB'},
    { value: 'elasticsearch', imageSrc: '/images/db-logos/elasticsearch.png', title: 'Elastic Search'}
  ]
});
