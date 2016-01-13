declare module "azure-mobile-apps/src/express" {
    function returnedFunction(configuration: Configuration): ExpressMobileApp;
    module returnedFunction { }
    export = returnedFunction;   
}

declare module "azure-mobile-apps/src/express/api" {
    function returnedFunction(configuration: Configuration): ExpressApi;
    module returnedFunction { }
    export = returnedFunction;   
}

declare module "azure-mobile-apps/src/express/table" {
    function returnedFunction(definition: TableDefinition): ExpressTable;
    module returnedFunction { }
    export = returnedFunction;   
}

declare module "azure-mobile-apps/src/express/tables" {
    function returnedFunction(configuration: Configuration): ExpressTables;
    module returnedFunction { }
    export = returnedFunction;   
}

interface ExpressMobileApp {
    configuration: Configuration;
    tables: ExpressTables;
    table(): ExpressTable;
    api: ExpressApi;
    use(middleware: Middleware | Middleware[]): void;
}

interface ExpressApi {
    add(name: string, definition: ApiDefinition): void;
    import(fileOrFolder: string): void;
}

interface ExpressTable {
    authorize: boolean;
    autoIncrement: boolean;
    dynamicSchema: boolean;
    name: string;
    columns: any;
    schema: string;

    use(middleware: Middleware | Middleware[]): void;
    read(operationHandler: (context: Context) => void): void;
    update(operationHandler: (context: Context) => void): void;
    insert(operationHandler: (context: Context) => void): void;
    delete(operationHandler: (context: Context) => void): void;
    undelete(operationHandler: (context: Context) => void): void;
}

interface ExpressTables {
    configuration: Configuration;
    add(name: string, definition: ExpressTable | TableDefinition): void;
    import(fileOrFolder: string): void;
    initialize(): Thenable<any>;
}

