// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = function (definition, method) {
    resolveProperty('authorize');
    resolveProperty('disable');

    if (definition[method].access) {
        switch(definition[method].access) {
            case 'authenticated':
                definition[method].authorize = true;
                definition[method].disable = false;
                break;

            case 'disabled':
                definition[method].authorize = false;
                definition[method].disable = true;
                break;

            case 'anonymous':
                definition[method].authorize = false;
                definition[method].disable = false;
                break;

            default:
                break;
        }
    }

    function resolveProperty(property) {
        if (definition[method].hasOwnProperty(property)) { 
            // already set on operation, do nothing
        } else if (definition.hasOwnProperty(property)) {
            // use table default if exists
            definition[method][property] = definition[property]
        } else {
            // if no setting, use false
            definition[method][property] = false;
        }
    }
}