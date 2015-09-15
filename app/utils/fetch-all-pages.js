import Ember from 'ember';

const {
  RSVP: { all, resolve },
  String: { pluralize }
} = Ember;

export default function fetchAllPages(store, owner, modelName) {
  let relationshipName = pluralize(modelName);
  let modelPromise = owner.get(relationshipName);

  return resolve(modelPromise)
    .then((items) => {
      let promises = [];
      let metadata = store.metadataFor(modelName);
      let currentPage = metadata.current_page;
      let totalPages = Math.ceil(metadata.total_count / metadata.per_page);

      if (!currentPage || !totalPages) {
        return items;
      }

      while (currentPage < totalPages) {
        let query = {
          page: ++currentPage
        };

        query[owner.constructor.modelName] = owner;

        promises.push( store.find(modelName, query) );
      }

      return all(promises)
        .then(function(results) {
          return items;
        });
    });
}
