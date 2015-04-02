import Ember from 'ember';
import DisallowAuthenticated from "diesel/mixins/routes/disallow-authenticated";

export default Ember.Route.extend(DisallowAuthenticated);
