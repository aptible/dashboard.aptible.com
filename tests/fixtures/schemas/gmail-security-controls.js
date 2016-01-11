export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "https://gridiron.aptible.com/schemas/gmail_security_controls/0.0.1",
  "type":"object",
  "title":"Gmail",
  "description": "Gmail security controls",
  "properties":{
    "linkSharingSettings":{
      "type":"boolean",
      "title":"Is your Gmail secure??",
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
  },
  "required":[
    "isSecure"
  ]
};