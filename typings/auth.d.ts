declare module "azure-mobile-apps/src/auth" {
    function returnedFunction(configuration: Configuration): Auth;
    module returnedFunction { }
    export = returnedFunction;   
}

interface User {
    id: string;
    claims: any[];
    token: string;
    getIdentity(provider: string): Thenable<any>;
}

interface Auth {
    validate(token: string): Thenable<User>;
    decode(token: string): User;
    sign(payload: any): string;
}