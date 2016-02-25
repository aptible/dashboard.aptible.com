export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "aptible_security_controls/1",
  "type":"object",
  "title":"Aptible",
  "description": "Aptible security controls",
  "properties":{
    "secure0":{
      "type":"boolean",
      "default":true,
      "readonly":true,
      "title":"Do you use Aptible?",
      "description":"secure description 0",
      "displayProperties":{
        "useToggle":true,
        "showLabels":true,
        "labels":{
          "trueLabel":"Yes",
          "falseLabel":"No"
        }
      }
    },
    "secure1":{
      "type":"boolean",
      "default":true,
      "readonly":true,
      "title":"Is Aptible secure?",
      "description":"secure description 1",
      "displayProperties":{
        "useToggle":true,
        "showLabels":true,
        "labels":{
          "trueLabel":"Yes",
          "falseLabel":"No"
        }
      }
    },
    "secure2":{
      "type":"boolean",
      "default":true,
      "readonly":true,
      "title":"What is Apdible?",
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

  },
  "required":[
    "limitOpenPorts"
  ]
};