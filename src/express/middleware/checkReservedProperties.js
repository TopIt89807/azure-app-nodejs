// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var errors = require('../../utilities/errors'),

    reservedProperties = ['createdAt', 'updatedAt', 'deleted'];

module.exports = function (req, res, next) {
    var reservedPropertyName = Object.keys(req.azureMobile.item)
        .find(function (property) { return reservedProperties.indexOf(property) > -1; });

    if(reservedPropertyName)
        next(errors.badRequest("Cannot update item with property '" + reservedPropertyName + "' as it is reserved"));
    else
        next();
};
