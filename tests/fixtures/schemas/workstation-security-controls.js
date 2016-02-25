export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id":"workstation_security_controls/1",
  "type":"object",
  "title":"Workstation Security Controls",
  "description": "Workstation security controls",
  "properties":{
    "keyboardLocks":{
      "type":"string",
      "enum":[
        "Safe",
        "Deadbolt",
        "No locks"
      ],
      "title":"Keyboard Locks",
      "description":"Do you lock your keyboards at night? If so, how?",
      "displayProperties":{
        "prompt":"Select..."
      }
    }
  },
  "required":[
    "keyboardLocks"
  ]
};