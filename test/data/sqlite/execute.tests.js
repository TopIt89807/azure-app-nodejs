var execute = require('../../../src/data/sqlite/execute'),
    expect = require('chai').expect;

describe('azure-mobile-apps.data.sqlite.execute', function () {
    it("executes basic query", function () {
        return execute({}, { sql: "select 1 as test" }).then(function (result) {
            expect(result).to.deep.equal([{ test: 1 }]);
        });
    });
});
