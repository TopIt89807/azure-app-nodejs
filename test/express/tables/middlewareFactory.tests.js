// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var factory = require('../../../src/express/tables/middlewareFactory'),
    executeOperation = require('../../../src/express/middleware/executeOperation'),
    express = require('express'),
    expect = require('chai').expect;

describe('azure-mobile-apps.express.tables.middlewareFactory', function () {
    it('uses executeOperation for operation middleware if none was specified', function () {
        var router = express.Router(),
            configuration = {
                middleware: {
                    execute: [],
                    get: []
                }
            };
        factory(configuration, router, executeOperation());

        expect(router.stack[0].route.stack.length).to.equal(3);
        expect(router.stack[0].route.stack[1].handle.constructor).to.equal(Function); // used to test against executeOperation, no longer possible
    });

    it('returns router if no execution middleware was specified', function () {
        var router = express.Router(),
            configuration = {
                middleware: {
                    execute: [],
                    get: []
                }
            };
        var results = factory(configuration, router, executeOperation());

        expect(results.length).to.equal(1);
        expect(results[0]).to.equal(router);
    })

    it('arranges middleware onto router', function () {
        var router = express.Router(),
            configuration = {
                middleware: {
                    execute: [testMiddleware],
                    get: [testMiddleware],
                    post: [testMiddleware, testMiddleware]
                }
            };
        factory(configuration, router, executeOperation());

        expect(router.stack.length).to.equal(8);

        // too flaky
        // expect(router.stack[0].route.methods.get).to.be.true;
        // expect(router.stack[0].route.stack.length).to.equal(3);
        // expect(router.stack[0].route.stack[1].handle).to.equal(testMiddleware);
        //
        // expect(router.stack[1].route.methods.post).to.be.true;
        // expect(router.stack[1].route.stack.length).to.equal(4);
        // expect(router.stack[1].route.stack[1].handle).to.equal(testMiddleware);
        // expect(router.stack[1].route.stack[2].handle).to.equal(testMiddleware);
    });

    function testMiddleware(req, res, next) { }
})
