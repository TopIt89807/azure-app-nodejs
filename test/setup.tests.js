var configuration = require('./infrastructure/configuration.js')(),
    configureGlobals = require('../src/configuration/from').configureGlobals;

beforeEach(function () {
    configureGlobals(configuration);
});
