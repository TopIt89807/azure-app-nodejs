// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

module.exports = function (configuration) {
    return function (table, columns) {
        return {
            id: table.name,
            properties: properties()
        };

        function properties() {
            return columns.reduce(function (target, column) {
                target[column.name] = mapType(column.type);
                return target;
            }, {});
        }
    };
};

function mapType(type) {
    return {
        type: ({
            'number': 'number',
            'string': 'string',
            'boolean': 'boolean',
            'datetime': 'string'
        })[type],
        format: ({
            'number': 'float',
            'string': undefined,
            'boolean': undefined,
            'datetime': 'date-time'
        })[type]
    }
}

/*
{
    "Category": {
      "id": "Category",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64"
        },
        "name": {
          "type": "string"
        }
      }
    }
}
*/
