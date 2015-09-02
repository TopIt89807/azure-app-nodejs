// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
The azure-mobile-apps logging framework.
@module azure-mobile-apps/logger
*/
var winston = require('winston'),
    logger = new (winston.Logger)();

/**
Exports an instance of a winston logger with the additional members described below.
@see {@link https://github.com/winstonjs/winston}
*/
module.exports = logger;

/**
Initialises the logger
@param {loggingConfiguration} config
*/
module.exports.configure = function (config) {
    config = config || {};

    clearTransports();
    addTransports(config);
}

function clearTransports() {
    Object.keys(logger.transports).forEach(function (transport) {
        logger.remove(transport);
    });
}

function addTransports(config) {
    if(config.transports) {
        Object.keys(config.transports).forEach(function (key) {
            logger.add(winston.transports[key], config.transports[key]);
            if(config.transports[key].level === undefined) {
                logger.transports[lowerCaseTransport(key)].level = config.level;
            }
        });
    }
}

// decapitalize transport to align with winston key convention
function lowerCaseTransport(transport) {
    return transport.charAt(0).toLowerCase() + transport.slice(1);
}
