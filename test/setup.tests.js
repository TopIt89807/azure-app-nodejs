var configuration = require('./infrastructure/config.js')(),
    configureGlobals = require('../src/configuration/from').configureGlobals;

beforeEach(function () {
    configureGlobals(configuration);
});
