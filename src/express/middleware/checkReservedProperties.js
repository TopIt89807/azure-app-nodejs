// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var errors = require('../../utilities/errors'),

    reservedProperties = ['createdAt', 'updatedAt', 'deleted'];

module.exports = function (req, res, next) {
    var properties = Object.keys(req.azureMobile.item),
        propertyName;

    for(var i = 0, l = properties.length; i < l && !propertyName; i++)
        if(reservedProperties.indexOf(properties[i]) > -1)
            propertyName = properties[i]

    if(propertyName)
        next(errors.badRequest("Cannot update item with property '" + propertyName + "' as it is reserved"));
    else
        next();
};
