// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
// there should be more tests here, but SQL tests can be fragile
// full coverage should be provided by integration tests

var expect = require('chai').expect,
    mssql = require('mssql'),
    statements = require('../../../src/data/sql/statements');

describe('azure-mobile-apps.data.sql.statements', function () {
    describe('insert', function () {
        var insert = statements.insert;

        it('generates simple statement and parameters', function () {
            var statement = insert({ name: 'table' }, { id: 'id', p1: 'value', p2: 2.2 });
            expect(statement.sql).to.equal('INSERT INTO [dbo].[table] ([id],[p1],[p2]) VALUES (@id,@p1,@p2); SELECT * FROM [dbo].[table] WHERE [id] = @id');
            expect(statement.parameters).to.deep.equal([{ name: 'id', type: mssql.NVarChar(255), value: 'id' }, { name: 'p1', type: mssql.NVarChar(), value: 'value' }, { name: 'p2', type: mssql.Float, value: 2.2 }]);
        });

        it('does not specify id when table has autoIncrement specified', function () {
            var statement = insert({ name: 'table', autoIncrement: true }, { id: 'id', p1: 'value' });
            expect(statement.sql).to.equal('INSERT INTO [dbo].[table] ([p1]) VALUES (@p1); SELECT * FROM [dbo].[table] WHERE [id] = SCOPE_IDENTITY()');
            expect(statement.parameters).to.deep.equal([{ name: 'p1', type: mssql.NVarChar(), value: 'value' }]);
        });
    });

    describe('update', function () {
        var update = statements.update;

        it('generates simple statement and parameters', function () {
            var statement = update({ name: 'table' }, { id: 'id', p1: 'value', p2: 2.2 });
            expect(statement.sql).to.equal('UPDATE [dbo].[table] SET [p1] = @p1,[p2] = @p2 WHERE [id] = @id ; SELECT @@ROWCOUNT as recordsAffected; SELECT * FROM [dbo].[table] WHERE [id] = @id');
            expect(statement.parameters).to.deep.equal([{ name: 'p1', type: mssql.NVarChar(), value: 'value' }, { name: 'p2', type: mssql.Float, value: 2.2 }, { name: 'id', type: mssql.NVarChar(255), value: 'id' }]);
        });
    });

    describe('delete', function () {
        var del = statements.delete;

        it('generates simple statement and parameters', function () {
            var statement = del({ name: 'table' }, 'id');
            expect(statement.sql).to.equal('DELETE FROM [dbo].[table] WHERE [id] = @id; SELECT @@rowcount AS recordsAffected; SELECT * FROM [dbo].[table] WHERE [id] = @id');
            expect(statement.parameters).to.deep.equal([{ name: 'id', value: 'id' }]);
        });
    });

    describe('updateSchema', function () {
        var updateSchema = statements.updateSchema;

        it('generates simple statement', function () {
            var statement = updateSchema({ name: 'table' }, [{ name: 'id' }], { id: 1, text: 'test' });
            expect(statement.sql).to.equal('ALTER TABLE [dbo].[table] ADD [text] NVARCHAR(MAX) NULL');
        });
    });

    describe('createTable', function () {
        var createTable = statements.createTable;

        it('generates create statement with string id', function () {
            var statement = createTable({ name: 'table' }, { id: '1', text: 'test' });
            expect(statement.sql).to.equal('CREATE TABLE [dbo].[table] ([id] NVARCHAR(255) NOT NULL PRIMARY KEY,__version ROWVERSION NOT NULL,__createdAt DATETIMEOFFSET(3) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(3),SYSUTCDATETIME(),0),__updatedAt DATETIMEOFFSET(3) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(3),SYSUTCDATETIME(),0),__deleted bit NOT NULL DEFAULT 0,[text] NVARCHAR(MAX) NULL) ON [PRIMARY]')
        });

        it('generates create statement with numeric id', function () {
            var statement = createTable({ name: 'table' }, { id: 1, text: 'test' });
            expect(statement.sql).to.equal('CREATE TABLE [dbo].[table] ([id] INT NOT NULL PRIMARY KEY,__version ROWVERSION NOT NULL,__createdAt DATETIMEOFFSET(3) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(3),SYSUTCDATETIME(),0),__updatedAt DATETIMEOFFSET(3) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(3),SYSUTCDATETIME(),0),__deleted bit NOT NULL DEFAULT 0,[text] NVARCHAR(MAX) NULL) ON [PRIMARY]')
        });

        it('generates create statement with string id if none is provided', function () {
            var statement = createTable({ name: 'table' }, { text: 'test' });
            expect(statement.sql).to.equal('CREATE TABLE [dbo].[table] ([id] NVARCHAR(255) NOT NULL PRIMARY KEY,__version ROWVERSION NOT NULL,__createdAt DATETIMEOFFSET(3) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(3),SYSUTCDATETIME(),0),__updatedAt DATETIMEOFFSET(3) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(3),SYSUTCDATETIME(),0),__deleted bit NOT NULL DEFAULT 0,[text] NVARCHAR(MAX) NULL) ON [PRIMARY]')
        });

        it('generates integer identity column when autoIncrement is specified', function () {
            var statement = createTable({ name: 'table', autoIncrement: true }, { text: 'test' });
            expect(statement.sql).to.equal('CREATE TABLE [dbo].[table] ([id] INT NOT NULL IDENTITY (1, 1) PRIMARY KEY,__version ROWVERSION NOT NULL,__createdAt DATETIMEOFFSET(3) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(3),SYSUTCDATETIME(),0),__updatedAt DATETIMEOFFSET(3) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(3),SYSUTCDATETIME(),0),__deleted bit NOT NULL DEFAULT 0,[text] NVARCHAR(MAX) NULL) ON [PRIMARY]')
        });

        it('generates create statement with predefined columns', function () {
            var statement = createTable({ name: 'table', columns: { number: 'number' } }, { text: 'test' });
            expect(statement.sql).to.equal('CREATE TABLE [dbo].[table] ([id] NVARCHAR(255) NOT NULL PRIMARY KEY,__version ROWVERSION NOT NULL,__createdAt DATETIMEOFFSET(3) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(3),SYSUTCDATETIME(),0),__updatedAt DATETIMEOFFSET(3) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(3),SYSUTCDATETIME(),0),__deleted bit NOT NULL DEFAULT 0,[text] NVARCHAR(MAX) NULL,[number] FLOAT(53)) ON [PRIMARY]')
        });
    });

    describe('createIndex', function () {
        var createIndex = statements.createIndex;

        it('generates simple statement', function () {
            var statement = createIndex({ name: 'table' }, 'foo');
            expect(statement.sql).to.equal('CREATE INDEX [foo] ON [dbo].[table] ([foo])');
        });

        it('generates statement with multiple index columns', function () {
            var statement = createIndex({ name: 'table' }, ['foo', 'bar', 'baz']);
            expect(statement.sql).to.equal('CREATE INDEX [foo,bar,baz] ON [dbo].[table] ([foo],[bar],[baz])');
        });
    })
});
