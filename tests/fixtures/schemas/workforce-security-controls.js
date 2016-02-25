export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "workforce_security_controls/1",
  "type":"object",
  "title":"Workforce Security Controls",
  "description": "Workforce security controls",
  "properties":{
    "robots":{
      "type":"boolean",
      "title":"Autonomous Workfroce",
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
  },
  "required":[
    "robots"
  ]
};