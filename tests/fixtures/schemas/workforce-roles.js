export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "https://gridiron.aptible.com/schemas/workforce_roles/0.0.1",
  "type":"array",
  "title":"Workforce Roles",
  "describe": "Organizational workforce and assigned roles.",
  "items":{
    "type":"object",
    "properties":{
      "name":{ "type":"string" },
      "email":{ "type":"email" },
      "isDeveloper":{
        "type":"boolean",
        "default": false
      },
      "isSecurityOfficer":{
        "type":"boolean",
        "default": false
      },
      "isRobot":{
        "type":"boolean",
        "default": false
      },
      "href":{ "type":"uri" }
    },
    "required":[
      "name",
      "email",
      "href",
      "isDeveloper",
      "isSecurityOfficer",
      "isRobot"
    ]
  },
  "required":[
    "0"
  ]
};