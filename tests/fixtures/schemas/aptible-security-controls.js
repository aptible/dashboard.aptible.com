export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "aptible_security_controls/1",
  "type":"object",
  "title":"Aptible",
  "description": "Aptible security controls",
  "properties":{
    "secure0":{
      "type": "object",
      "title":"Do you use Aptible?",
      "required": ["implemented"],
      "properties": {
        "implemented": {
          "type":"boolean",
          "default":true,
          "readonly":true,
          "description":"secure description 0",
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
    },

    "secure1":{
      "type": "object",
      "title":"Is Aptible secure?",
      "required": ["implemented"],
      "properties": {
        "implemented": {
          "type":"boolean",
          "default":true,
          "readonly":true,

          "description":"secure description 1",
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
    },

    "secure2":{
      "type": "object",
      "title":"What is Apdible?",
      "required": ["implemented"],
      "properties": {
        "implemented": {
          "type":"boolean",
          "default":true,
          "readonly":true,
          "description":"secure description 2",
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
    "limitOpenPorts"
  ]
};