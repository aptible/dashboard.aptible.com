export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "security_procedures_security_controls/1",
  "type":"object",
  "title":"Security Procedures",
  "description": "Organizational Security Procedures",
  "properties":{
    "security_controls": {
      "type": "object",
      "properties": {
        "secureProcedure0":{
          "type": "object",
          "required": ["implemented"],
          "title":"Do you secure?",
          "properties": {
            "implemented": {
              "type":"boolean",
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
          }
        }
      }
    }
  },

  "required":[
    "identifyAllComponentsAndDependencies"
  ]
};