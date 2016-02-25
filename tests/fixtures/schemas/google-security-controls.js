export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "google_security_controls/1",
  "type":"object",
  "title":"Google",
  "description": "Google security controls",
  "properties":{
    "security":{
      "type":"string",
      "enum":[
        "Wow",
        "Amaze",
        "Such security",
        "No securitys  here"
      ],
      "title":"How much security can your googles haz?",
      "description":"Wow",
      "displayProperties":{
        "prompt":"Select..."
      }
    }
  },
  "required":[
    "security"
  ]
};