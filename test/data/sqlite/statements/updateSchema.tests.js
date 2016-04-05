// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
// there should be more tests here, but SQL tests can be fragile
// full coverage should be provided by integration tests

var expect = require("chai").use(require("chai-subset")).expect,
    mssql = require("mssql"),
    statements = require("../../../../src/data/sqlite/statements");

describe("azure-mobile-apps.data.sqlite.statements", function () {
    describe("updateSchema", function () {
        var updateSchema = statements.updateSchema;

        it("generates simple statement", function () {
            var statement = updateSchema({ name: "table" }, [{ name: "id" }, { name: "version" }, { name: "createdAt" }, { name: "updatedAt" }, { name: "deleted" }], { id: 1, text: "test" });
            expect(statement).to.containSubset([{ sql: "ALTER TABLE [table] ADD COLUMN [text] TEXT NULL" }]);
        });

        it("generates system properties if missing", function () {
            var statement = updateSchema({ name: "table" }, [{ name: "id" }], { id: 1, text: "test" });
            expect(statement).to.containSubset([
                { sql: "ALTER TABLE [table] ADD COLUMN [text] TEXT NULL" },
                { sql: "ALTER TABLE [table] ADD COLUMN version TEXT NOT NULL DEFAULT 1" },
                { sql: "ALTER TABLE [table] ADD COLUMN createdAt TEXT NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'))" },
                { sql: "ALTER TABLE [table] ADD COLUMN updatedAt TEXT NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'))" },
                { sql: "ALTER TABLE [table] ADD COLUMN deleted INTEGER NOT NULL DEFAULT 0" }
            ]);
        });

        it("correctly handles missing system properties that exist in item", function () {
            var statement = updateSchema({ name: "table" }, [{ name: "id" }, { name: "createdAt" }, { name: "updatedAt" }, { name: "deleted" }], { id: 1, text: "test", version: "someVersion" });
            expect(statement).to.containSubset([
                { sql: "ALTER TABLE [table] ADD COLUMN [text] TEXT NULL" },
                { sql: "ALTER TABLE [table] ADD COLUMN version TEXT NOT NULL DEFAULT 1" }
            ]);
        });

        it("generates statement for predefined columns", function () {
            var statement = updateSchema(
                { name: "table", columns: { "text": "string" } },
                [{ name: "id" }, { name: "createdAt" }, { name: "updatedAt" }, { name: "deleted" }, { name : "version" }],
                { id: 1 }
            );
            expect(statement).to.containSubset([{ sql: "ALTER TABLE [table] ADD COLUMN [text] TEXT NULL" }]);
        });

        it("generates statement for predefined columns when item is not supplied", function () {
            var statement = updateSchema(
                { name: "table", columns: { "text": "string" } },
                [{ name: "id" }, { name: "createdAt" }, { name: "updatedAt" }, { name: "deleted" }, { name : "version" }]
            );
            expect(statement).to.containSubset([{ sql: "ALTER TABLE [table] ADD COLUMN [text] TEXT NULL" }]);
        });
    });
});
