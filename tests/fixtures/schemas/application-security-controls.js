export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "application_security_controls/1",
  "type":"object",
  "title":"Global Application Security Controls",
  "description": "Global application security controls",
  "properties":{
    "security_controls": {
      "type": "object",
      "properties": {

        "hiddenTokens":{
          "type": "object",
          "title":"Can haz secures?",
          "required": ["implemented"],
          "properties": {
            "implemented": {
              "type":"boolean",
              "description":"Wow",
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
      "requried": ["hiddenTokens"]
    }
  },
  "required":[
    "security_controls"
  ]
};