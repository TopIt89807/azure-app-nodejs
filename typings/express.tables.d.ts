interface ExpressTables {
    configuration: Configuration;
    add(name: string, definition: any): void;
    import(fileOrFolder: string): void;
    initialize(): Thenable<any>;
}

declare module "azure-mobile-apps/express/tables" {
    function returnedFunction(configuration: Configuration): ExpressTables;
    module returnedFunction { }
    export = returnedFunction;   
}
