export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "amazon_s3_security_controls/1",
  "type":"object",
  "title":"Amazon Simple Storage Service (Amazon S3)",
  "description": "Amazon Simple Storage Service security controls",
  "properties":{
    "encryption":{
      "type":"string",
      "enum":[
        "Encrypt all the secures",
        "Encrypt some securities",
        "Encrypt no secures"
      ],
      "title":"Encrypting your secures",
      "description":"How do you encrypt your security on S3?",
      "displayProperties":{
        "prompt":"Select..."
      }
    }
  },
  "required":[
    "encryption"
  ]
};