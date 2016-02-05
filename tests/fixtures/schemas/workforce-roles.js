export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "https://gridiron.aptible.com/schemas/workforce_roles/1.0.0",
  "type":"array",
  "title":"Workforce",
  "describe": "Organizational workforce and assigned roles.",
  "items":{
    "type":"object",
    "properties":{
      "name":{ "type":"string" },
      "email":{ "type":"email" },
      "href":{ "type":"uri" },
      "hasAptibleAccount": { "type": "boolean" },
      "isDeveloper":{
        "title": "Developer Group",
        "description": "Any Aptible user who has permission to create, modify, or delete any company information system, application, or database.  Developers must complete Advanced HIPAA Privacy & Security Training for Developers, in addition to Basic HIPAA Security and Privacy Training.",
        "type":"boolean",
        "default": false
      },
      "isSecurityOfficer":{
        "title": "Security Group",
        "description": "Any Aptible user who has permission to create, modify, or delete Risk Assessments, Policies & Procedures, or Application Security Interviews.  Security Group users must complete Security Officer Training, Advanced HIPAA Privacy & Security Training for Developers, and Basic HIPAA Security and Privacy Training.",
        "type":"boolean",
        "default": false
      },
      "isRobot":{
        "title": "Robot Users",
        "description": "Any Aptible account that does not belong to a member of your workforce--e.g. an account created for Circle CI or Travis. Robot users will receive no training notifications.",
        "type":"boolean",
        "default": false
      }
    },
    "required":[
      "email",
      "isDeveloper",
      "isSecurityOfficer",
      "isRobot"
    ],
    "dependencies": {
      "name": ["hasAptibleAccount"],
      "href": ["hasAptibleAccount"]
    }
  },
  "required":[
    "0"
  ]
};