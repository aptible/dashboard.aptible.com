export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "google_security_controls/1",
  "type":"object",
  "title":"Google",
  "description": "Google security controls",
  "properties":{
    "security_controls": {
      "type": "object",
      "properties": {
        "security":{
          "type": "object",
          "title":"How much security can your googles haz?",
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
    "security_controls"
  ]
};
