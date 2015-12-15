var config = require('./express/infrastructure/config.js')() || {};
var configureGlobals = require('../src').configureGlobals;

beforeEach(function () {
    configureGlobals(config);
});