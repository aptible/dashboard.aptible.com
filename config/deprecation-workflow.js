window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Ember.create is deprecated in favor of Object.create" },
    { handler: "silence", matchMessage: "Passing the dependentKeys after the callback function in Ember.observer is deprecated. Ensure the callback function is the last argument." },
    { handler: "silence", matchMessage: "Ember.reduceComputed is deprecated. Replace it with plain array methods" },
    { handler: "silence", matchMessage: "Ember.keys is deprecated in favor of Object.keys" },
    { handler: "silence", matchMessage: "`lookupFactory` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container." },
    { handler: "silence", matchMessage: "`lookup` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container." },
    { handler: "silence", matchMessage: "Ember.View is deprecated. Consult the Deprecations Guide for a migration strategy." },
    { handler: "silence", matchMessage: /Accessing 'template' in <diesel@component:bs-alert-dismiss/ },
    { handler: "silence", matchMessage: /Accessing 'template' in <diesel@component:flash-message/ },
    { handler: "silence", matchMessage: "Ember.Select is deprecated. Consult the Deprecations Guide for a migration strategy." },
    { handler: "silence", matchMessage: "A container should only be created for an already instantiated registry. For backward compatibility, an isolated registry will be instantiated just for this container." },
    { handler: "silence", matchMessage: "Controller#needs is deprecated, please use Ember.inject.controller() instead" },
    { handler: "silence", matchMessage: "In Ember 2.0 service factories must have an `isServiceFactory` property set to true. You registered (unknown mixin) as a service factory. Either add the `isServiceFactory` property to this factory or extend from Ember.Service." },
    { handler: "silence", matchMessage: "A container should only be created for an already instantiated registry. For backward compatibility, an isolated registry will be instantiated just for this container." }
  ]
};
