export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "https://gridiron.aptible.com/schemas/security_procedures_security_controls/0.0.1",
  "type":"object",
  "title":"Security Procedures",
  "description": "Organizational Security Procedures",
  "properties":{
    "secureProcedure0":{
      "type":"boolean",
      "title":"Do you secure?",
      "description":"??",
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