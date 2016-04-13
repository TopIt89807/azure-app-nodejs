var expect = require('chai').expect,
    connectionPool = require('../../../src/data/sqlite/connectionPool');

describe('azure-mobile-apps.data.sqlite.connections', function () {
    it('obtain creates database connections', function () {
        var connection = connectionPool().obtain();
        expect(connection).to.be.a('database');
    });

    it('obtain returns the same connection each call for in memory database', function () {
        var pool = connectionPool();
        expect(pool.obtain()).to.equal(pool.obtain());
    });

    it('obtain returns a new connection for subsequent calls for file database', function () {
        var pool = connectionPool({ filename: 'test.sqlite' });
        expect(pool.obtain()).to.not.equal(pool.obtain());
    });
    
    it('obtain returns released connections for file database', function () {
        var pool = connectionPool({ filename: 'test.sqlite' }),
            connection = pool.obtain();
            
        pool.release(connection);
        expect(pool.obtain()).to.equal(connection);
    });
});