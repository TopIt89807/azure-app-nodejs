declare module "azure-mobile-apps/src/data" {
    function returnedFunction(configuration: Configuration): (table: ExpressTable) => Data;
    module returnedFunction { }
    export = returnedFunction;   
}

interface Data {
    read(query: QueryJs): Thenable<any[]>;
    update(item: any, query: QueryJs): Thenable<any>;
    insert(item: any): Thenable<any>;
    delete(query: QueryJs, version: string): Thenable<any>;
    undelete(query: QueryJs, version: string): Thenable<any>;
    truncate(): Thenable<void>;
    initialize(): Thenable<void>;
    schema(): Thenable<SchemaResult[]>;
}

interface SchemaResult {
    name: string;
    type: string;
}