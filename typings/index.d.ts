declare module "azure-mobile-apps" {
    function returnedFunction(configuration: Configuration): Express;
    module returnedFunction { }
    export = returnedFunction;   
}

interface Thenable<R> {
    then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
}
