// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
// there should be more tests here, but SQL tests can be fragile
// full coverage should be provided by integration tests

var expect = require('chai').expect,
    mssql = require('mssql'),
    statements = require('../../../../src/data/sqlite/statements');

describe('azure-mobile-apps.data.sqlite.statements', function () {
    describe('createTable', function () {
        var createTable = statements.createTable;

        it('generates create statement with string id', function () {
            var statement = createTable({ name: 'table' }, { id: '1', text: 'test' });
            expect(statement.sql).to.equal('CREATE TABLE [table] ([id] TEXT PRIMARY KEY,version TEXT NOT NULL,createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,deleted INTEGER NOT NULL DEFAULT 0,[text] TEXT NULL)')
        });

        it('generates create statement with numeric id', function () {
            var statement = createTable({ name: 'table' }, { id: 1, text: 'test' });
            expect(statement.sql).to.equal('CREATE TABLE [table] ([id] INTEGER PRIMARY KEY,version TEXT NOT NULL,createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,deleted INTEGER NOT NULL DEFAULT 0,[text] TEXT NULL)')
        });

        it('generates create statement with string id if none is provided', function () {
            var statement = createTable({ name: 'table' }, { text: 'test' });
            expect(statement.sql).to.equal('CREATE TABLE [table] ([id] TEXT PRIMARY KEY,version TEXT NOT NULL,createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,deleted INTEGER NOT NULL DEFAULT 0,[text] TEXT NULL)')
        });

        it('generates integer identity column when autoIncrement is specified', function () {
            var statement = createTable({ name: 'table', autoIncrement: true }, { text: 'test' });
            expect(statement.sql).to.equal('CREATE TABLE [table] ([id] INTEGER PRIMARY KEY,version TEXT NOT NULL,createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,deleted INTEGER NOT NULL DEFAULT 0,[text] TEXT NULL)')
        });

        it('generates create statement with predefined columns', function () {
            var statement = createTable({ name: 'table', columns: { number: 'number' } }, { text: 'test' });
            expect(statement.sql).to.equal('CREATE TABLE [table] ([id] TEXT PRIMARY KEY,version TEXT NOT NULL,createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,deleted INTEGER NOT NULL DEFAULT 0,[text] TEXT NULL,[number] REAL)')
        });

        it('generates create statement without an item', function () {
            var statement = createTable({ name: 'table', columns: { number: 'number' } });
            expect(statement.sql).to.equal('CREATE TABLE [table] ([id] TEXT PRIMARY KEY,version TEXT NOT NULL,createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,deleted INTEGER NOT NULL DEFAULT 0,[number] REAL)')
        });
    });
});
