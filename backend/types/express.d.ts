export interface AuthUser {
    userId?: string;
    email?: string;
    [key: string]: any;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export {};
