// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
// there should be more tests here, but SQL tests can be fragile
// full coverage should be provided by integration tests

var expect = require('chai').expect,
    mssql = require('mssql'),
    statements = require('../../../../src/data/mssql/statements');

describe('azure-mobile-apps.data.sql.statements', function () {
    describe('delete', function () {
        var del = statements.delete;

        it('generates simple statement and parameters', function () {
            var statement = del({ name: 'table' }, 'id');
            expect(statement.sql).to.equal('SELECT * FROM [dbo].[table] WHERE [id] = @id;DELETE FROM [dbo].[table] WHERE [id] = @id;SELECT @@rowcount AS recordsAffected;');
            expect(statement.parameters).to.deep.equal([{ name: 'id', value: 'id' }]);
        });

        it('generates soft delete statement and params', function () {
            var statement = del({ name: 'table', softDelete: true }, 'id');
            expect(statement.sql).to.equal('UPDATE TOP (1) [dbo].[table] SET [deleted] = 1 WHERE [id] = @id AND [deleted] = 0;SELECT @@rowcount AS recordsAffected;SELECT * FROM [dbo].[table] WHERE [id] = @id;');
            expect(statement.parameters).to.deep.equal([{ name: 'id', value: 'id' }]);
        });
    });
});
