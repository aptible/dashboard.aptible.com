export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "workforce_security_controls/1",
  "type":"object",
  "title":"Workforce Security Controls",
  "description": "Workforce security controls",
  "properties":{
    "security_controls": {
      "type": "object",
      "properties": {
        "robots":{
          "type": "object",
          "required": ["implemented"],
          "title":"Autonomous Workforce",
          "properties": {
            "implemented": {
              "type":"boolean",
              "description":"Do you only hire robots?",
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
    "security_controls"
  ]
};