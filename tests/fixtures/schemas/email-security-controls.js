export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id":"workstation_security_controls/1",
  "type":"object",
  "title":"Email Security Controls",
  "description": "Email security controls",
  "properties":{
    "security_controls" : {
      "type": "object",
      "properties": {
        "encryption":{
          "type": "object",
          "required": ["implemented"],
          "title":"Do you encrypt?",
          "properties": {
            "implemented": {
              "type":"boolean",
              "description":"Do you encrypt emails?",
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
      },
      "required": [
        "encryption"
      ]
    }
  },

  "required":[
    "security_controls"
  ]
};