export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id":"workstation_security_controls/1",
  "type":"object",
  "title":"Workstation Controls",
  "description": "Workstation security controls",
  "properties":{
    "keyboardLocks":{
      "type": "object",
      "required": ["implemented"],
      "title":"Keyboard Locks",
      "properties": {
        "implemented": {
          "type":"boolean",
          "description":"Do you require your workforce to lock their keyboards using a keyboard lock?",
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

  "required":[
    "keyboardLocks"
  ]
};