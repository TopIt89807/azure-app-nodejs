var transactions = require('../../../src/data/sqlite/transactions'),
    promises = require('../../../src/utilities/promises'),
    sqlite = require('sqlite3'),
    fs = require('fs'),
    expect = require('chai').use(require('chai-as-promised')).expect;

describe('azure-mobile-apps.data.sqlite.transactions', function () {
    var statements = [
        { sql: "create table test (id integer primary key)" },
        { sql: "insert into test default values" },
        { sql: "insert into test default values" },
        { sql: "select * from test" }
    ];
    
    afterEach(function () {
        try{
            fs.unlinkSync('test.sqlite');
        } catch(err) { }
    })
    
    it("executes multiple statements", function () {
        return transactions()(statements).then(function (rows) {
            expect(rows).to.deep.equal([{ id: 1 }, { id: 2 }]);
        });
    });
    
    // it("isolates statements when using file database", function () {
    //     var transaction = transactions({ filename: 'test.sqlite' });
    //     transaction(statements);
    //     return expect(transaction([{ sql: "select * from test" }])).to.be.rejectedWith('no such table: test');
    // });
    
    // it("isolates multiple inserts and reads", function () {
    //     var transaction = transactions({ filename: 'test.sqlite' });
    //     return transaction([{ sql: 'create table test (value text)' }])
    //         .then(function () {
    //             return promises.all([
    //                 transaction(createStatements('1')).then(verifyResult('1')),
    //                 transaction(createStatements('2')).then(verifyResult('2')),
    //                 transaction(createStatements('3')).then(verifyResult('3'))
    //             ]);
    //         });
            
    //     function createStatements(value) {
    //         return [
    //             { sql: 'delete from test' },
    //             { sql: 'insert into test values (@value)', parameters: { value: value } },
    //             { sql: 'select * from test' }
    //         ];
    //     }
        
    //     function verifyResult(value) {
    //         return function (result) {
    //             expect(result).to.deep.equal([{ value: value }]);
    //         };
    //     }
    // });

    it("isolates generated primary keys", function () {
        var transaction = transactions({ filename: 'test.sqlite' });
        return transaction([{ sql: 'create table test (id integer primary key)' }])
            .then(function () {
                return promises.all([
                    transaction(createStatements()).then(verifyResult(1)),
                    transaction(createStatements()).then(verifyResult(2)),
                    transaction(createStatements()).then(verifyResult(3))
                ]);
            });
            
        function createStatements() {
            return [
                { sql: 'insert into test default values' },
                { sql: 'select last_insert_rowid() as rowid' }
            ];
        }
        
        function verifyResult(value) {
            return function (result) {
                expect(result).to.deep.equal([{ rowid: value }]);
            };
        }
    });
});