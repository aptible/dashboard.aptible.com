export default {
  "$schema":"http://json-schema.org/draft-04/schema#",
  "id": "workforce_locations/1",
  "type":"array",
  "title":"Workforce Locations",
  "description": "Workforce locations",
  "items":{
    "type":"object",
    "properties":{
      "description":{
        "type":"string",
        "title":"Location description",
        "displayProperties":{
          "placeholder":"e.g. Headquarters"
        }
      },
      "streetAddress":{
        "type":"string",
        "title":"Street address"
      },
      "city":{
        "type":"string",
        "title":"City"
      },
      "state":{
        "type":"string",
        "title":"State",
        "enum":[
          "Alabama",
          "Alaska",
          "Arizona",
          "Arkansas",
          "California",
          "Colorado",
          "Connecticut",
          "Delaware",
          "District Of Columbia",
          "Florida",
          "Georgia",
          "Hawaii",
          "Idaho",
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Kentucky",
          "Louisiana",
          "Maine",
          "Maryland",
          "Massachusetts",
          "Michigan",
          "Minnesota",
          "Mississippi",
          "Missouri",
          "Montana",
          "Nebraska",
          "Nevada",
          "New Hampshire",
          "New Jersey",
          "New Mexico",
          "New York",
          "North Carolina",
          "North Dakota",
          "Ohio",
          "Oklahoma",
          "Oregon",
          "Pennsylvania",
          "Rhode Island",
          "South Carolina",
          "South Dakota",
          "Tennessee",
          "Texas",
          "Utah",
          "Vermont",
          "Virginia",
          "Washington",
          "West Virginia",
          "Wisconsin",
          "Wyoming"
        ]
      },
      "zip":{
        "type":"string",
        "title":"Zip"
      }
    },
    "required":[
      "description",
      "streetAddress",
      "city",
      "state",
      "zip"
    ]
  },
  "required":[
    "0"
  ]
};