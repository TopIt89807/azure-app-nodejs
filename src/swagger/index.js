// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var tableApi = require('./tableApi');

module.exports = function (configuration) {
    var tableApiDefinition = tableApi(configuration);

    return function (baseUrl) {
        return {
            swaggerVersion: "1.2",
            basePath: baseUrl,
            apis: configuration.tables.map(tableApiDefinition)
        };
    };
};

/*
{
  "swaggerVersion": "1.2",
  "basePath": "http://localhost:8000/greetings",
  "apis": [
    {
      "path": "/hello/{subject}",
      "operations": [
        {
          "method": "GET",
          "summary": "Greet our subject with hello!",
          "type": "string",
          "nickname": "helloSubject",
          "parameters": [
            {
              "name": "subject",
              "description": "The subject to be greeted.",
              "required": true,
              "type": "string",
              "paramType": "path"
            }
          ]
        }
      ]
    }
  ],
  "models": {}
}
*/
