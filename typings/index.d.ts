declare module "azure-mobile-apps" {
    function returnedFunction(configuration?: Configuration): ExpressMobileApp;
    module returnedFunction { }
    export = returnedFunction;   
}

declare var logger: Logger;
declare module "azure-mobile-apps/src/logger" {
    export = logger;
}

interface Context {
    query: QueryJs;
    id: string | number;
    item: any;
    req: Request;
    res: Response;
    data: (table: TableDefinition) => Data;
    tables: (tableName: string) => Data;
    user: User;
    push: NotificationHubService;
    logger: Logger;
}

interface TableDefinition {
    authorize: boolean;
    autoIncrement: boolean;
    dynamicSchema: boolean;
    name: string;
    columns: any;
    schema: string;
}

interface ApiDefinition {
    authorize: boolean;
    get: Middleware | Middleware[];    
    post: Middleware | Middleware[];    
    patch: Middleware | Middleware[];    
    put: Middleware | Middleware[];    
    delete: Middleware | Middleware[];    
}

interface Thenable<R> {
    then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
}

interface Logger {
    log(level: string, ...message: any[]): void;
    silly(...message: any[]): void;
    debug(...message: any[]): void;
    verbose(...message: any[]): void;
    info(...message: any[]): void;
    warn(...message: any[]): void;
    error(...message: any[]): void;
}

interface Middleware {
    (req: Request, res: Response, next: NextMiddleware): void;
}

interface Request {
    
}

interface Response {
    
}

interface NextMiddleware {
    (error?: any): void;
}