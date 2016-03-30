// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').use(require('chai-subset')).expect,
    mssql = require('mssql'),
    statements = require('../../../../src/data/sqlite/statements'),
    queries = require('../../../../src/query');

describe('azure-mobile-apps.data.sqlite.statements', function () {
    describe('undelete', function () {
        it('generates simple statement and parameters', function () {
            var statement = statements.undelete({ name: 'table' }, queries.create('table').where({ id: 'id' }));
            expect(statement.sql).to.equal('UPDATE [table] SET deleted = 0 WHERE ([id] = @p1); SELECT @@rowcount AS recordsAffected; SELECT * FROM [table] WHERE ([id] = @p1)');
            expect(statement.parameters).to.containSubset([{ name: 'p1', value: 'id' }]);
        });
    });
});
