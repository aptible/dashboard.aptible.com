export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "SPD_secure_software_development/1",
  "type":"object",
  "title":"Secure Software Development",
  "properties":{
    "security_controls": {
      "type": "object",
      "properties": {
        "security":{
          "type": "object",
          "title":"Do you secure?",
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
      }
    }
  },

  "required":[
    "identifyAllComponentsAndDependencies"
  ]
};