export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "https://gridiron.aptible.com/schemas/security_procedures_security_controls/0.0.1",
  "type":"object",
  "title":"Security Procedures",
  "description": "Organizational Security Procedures",
  "properties":{
    "identifyAllComponentsAndDependencies":{
      "type":"boolean",
      "title":"Identify all Components and Dependencies",
      "description":"Do you maintain an easily-accessible list of all application components and dependencies, to facilitate security audits?",
      "displayProperties":{
        "useToggle":true,
        "showLabels":true,
        "labels":{
          "trueLabel":"Yes",
          "falseLabel":"No"
        }
      }
    }
  },
  "required":[
    "identifyAllComponentsAndDependencies"
  ]
};