// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

module.exports = function (configuration) {
    return function (table, schema) {
        return {
            type: 'object',
            properties: properties()
        };

        function properties() {
            return schema.properties.reduce(function (target, property) {
                target[property.name] = mapType(property.type);
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
