// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var log = require('../src/logger'),
    winston = require('winston'),
    expect = require('chai')
                .use(require('chai-subset'))
                .expect;

describe('azure-mobile-apps.logger', function () {
    it("initializes with proper configuration", function () {
        var config = {
            transports: {
                Console: {
                    level: 'error',
                    colorize: true,
                    timestamp: true,
                    showLevel: true
                },
                File: {
                    level: 'verbose',
                    colorize: false,
                    timestamp: true,
                    showLevel: true,
                    filename: 'testfile.txt'
                }
            }
        };

        log.configure(config);
        expectConfig(config);
    });

    it("sets new config on configure", function () {
        var oldConfig = {
            transports: {
                Console: {
                    level: 'error',
                    colorize: true,
                    timestamp: true,
                    showLevel: true
                }
            }
        },
            newConfig = {
            transports: {
                File: {
                    level: 'verbose',
                    colorize: false,
                    timestamp: true,
                    showLevel: true,
                    filename: 'testfile.txt'
                }
            }
        };

        log.configure(oldConfig);
        expectConfig(oldConfig);
        log.configure(newConfig);
        expectConfig(newConfig);

        // test that the old config transport does not exist
        Object.keys(oldConfig.transports).forEach(function (transport) {
            var lowerTransport = transport.toLowerCase();
            expect(log.transports).to.not.have.property(lowerTransport);
        });
    });

    it("exposes custom transport addition", function () {
        var config = {
            transports: {
                Console: {
                    level: 'error',
                    colorize: true,
                    timestamp: true,
                    showLevel: true
                }
            }
        };

        log.configure(config);
        expectConfig(config);

        log.add(winston.transports.File, {
            filename: 'test.txt'
        });

        config.transports.File = { filename: 'test.txt' };

        expectConfig(config);
    });

    function expectConfig(config) {
        Object.keys(config.transports).forEach(function (transport) {
            var lowerTransport = transport.toLowerCase();
            expect(log.transports).to.have.property(lowerTransport);
            expect(log.transports[lowerTransport]).to.containSubset(config.transports[transport]);
        });
    }
});
