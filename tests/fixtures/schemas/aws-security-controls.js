export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "aws_security_controls/1",
  "type":"object",
  "title":"Amazon Web Services",
  "description":"Amazon Web Services security controls",
  "properties":{
    "mfa":{
      "type": "object",
      "required": ["implemented"],
      "title":"AWS Security",
      "properties": {
        "implemented": {
          "type":"boolean",
          "description":"Is yer AWS secure?",
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
    "security"
  ]
};
