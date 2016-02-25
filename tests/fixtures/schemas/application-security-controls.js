export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "application_security_controls/1",
  "type":"object",
  "title":"Global Application Security Controls",
  "description": "Global application security controls",
  "properties":{
    "hiddenTokens":{
      "type":"boolean",
      "title":"Can haz secures?",
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
  },
  "required":[
    "hiddenTokens"
  ]
};