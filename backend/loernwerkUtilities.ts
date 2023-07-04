import { NextFunction, Request, Response } from 'express';

/**
 * Express middleware for checking user authentication.
 * Responds with a 401 statuscode if the user isn't logged in.
 * @param req Request object
 * @param res Return object
 * @param next Next handler function
 */
export function requireLogin(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (!req.session.userId) {
        res.sendStatus(401);
        return;
    }
    next();
}

/**
 * Express middleware for checking admin authentication.
 * Responds with a 401 statuscode if the user isn't logged in,
 * or a 403 status code if the user isn't logged in as admin.
 * @param req Request object
 * @param res Return object
 * @param next Next handler function
 */
export function requireAdmin(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (!req.session.userId) {
        res.sendStatus(401);
        return;
    }
    if (!req.session.isAdmin) {
        res.sendStatus(403);
        return;
    }
    next();
}

// Declaring session information
declare module 'express-session' {
    interface SessionData {
        userId?: string;
        isAdmin?: boolean;
    }
}

/**
 * Custom error class allowing to specify the error code in the constructor.
 */
export class LoernwerkError extends Error {
    code: LoernwerkErrorCodes;

    /**
     * Constructs a new error with the given message and error code.
     * @param message Message of the error
     * @param code Error code
     */
    constructor(message: string, code: LoernwerkErrorCodes) {
        super(message);
        this.code = code;
    }
}

export enum LoernwerkErrorCodes {
    ALREADY_EXISTS = 'ALREADY_EXISTS',
    INSUFFICENT_INFORMATION = 'INSUFFICENT_INFORMATION',
    AMBIGUOUS_INFORMATION = 'AMBIGUOUS_INFORMATION',
    NOT_FOUND = 'NOT_FOUND',
    BAD_REQUEST = 'BAD_REQUEST',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    UNKNOWN = 'UNKNOWN',
}
