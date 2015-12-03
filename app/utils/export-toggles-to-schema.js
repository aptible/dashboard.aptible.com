import Ember from 'ember';

export default function exportTogglesToSchema(toggleProperties, schema) {
  schema = Ember.$.extend(true, {}, schema);

  for(var key in toggleProperties) {
    let property = toggleProperties[key];

    schema.properties[key] = {
      type: 'boolean',
      displayProperties: {
        title: property.title,
        description: property.description,
        useToggle: true,
        showLabels: true,
        labels: {
          trueLabel: 'Yes',
          falseLabel: 'No'
        }
      }
    };

    schema.required.push(key);
  }

  return schema;
}