var execute = require('../../../src/data/sqlite/execute'),
    expect = require('chai').expect;

describe('azure-mobile-apps.data.sqlite.execute', function () {
    it("executes basic query", function () {
        return execute({}, { sql: "select 1 as test" }).then(function (result) {
            expect(result).to.deep.equal([{ test: 1 }]);
        });
    });

    it("executes query with parameters", function () {
        return execute({}, { sql: "select @p1 as test", parameters: { p1: 'test' } }).then(function (result) {
            expect(result).to.deep.equal([{ test: 'test' }]);
        });
    });

    it("executes multiple statements", function () {
        return execute({}, [
            { sql: "select @p1 as test", parameters: { p1: 'test' } },
            { sql: "select @p1 as test", parameters: { p1: 'test' } }
        ]).then(function (result) {
            expect(result).to.deep.equal([{ test: 'test' }]);
        });
    });
});
