export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "gmail_security_controls/1",
  "type":"object",
  "title":"Gmail",
  "description": "Gmail security controls",
  "properties":{
    "linkSharingSettings":{
      "type": "object",
      "required": ["implemented"],
      "title":"Is your Gmail secure??",
      "properties": {
        "implemented": {
          "type":"boolean",
          "description":"How secure is it?",
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
    "isSecure"
  ]
};