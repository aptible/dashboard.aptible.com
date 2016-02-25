export default {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "selected_data_environments/1",
  "type":"object",
  "title":"Data Environments",
  "description": "Data environments you use to handle PHI",
  "properties":{
    "aptible":{
      "type":"boolean",
      "default":true,
      "title":"Aptible",
      "readonly":true,
      "displayProperties":{
        "provider":"aptible",
        "useToggle":true,
        "labels":{
          "trueLabel":"Yes",
          "falseLabel":"No"
        }
      }
    },
    "amazonS3":{
      "type":"boolean",
      "title":"Amazon Simple Storage Service (Amazon S3)",
      "displayProperties":{
        "provider":"aws",
        "useToggle":true,
        "labels":{
          "trueLabel":"Yes",
          "falseLabel":"No"
        }
      }
    },
    "gmail":{
      "type":"boolean",
      "title":"Gmail",
      "displayProperties":{
        "provider":"google",
        "useToggle":true,
        "labels":{
          "trueLabel":"Yes",
          "falseLabel":"No"
        }
      }
    }
  },
  "required":[
    "aptible",
    "amazonS3",
    "googleCalendar",
    "googleDrive",
    "gmail",
    "mailgun"
  ]
};