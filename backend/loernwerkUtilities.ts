import { NextFunction, Request, Response } from 'express';
import { IUser } from '@lumieducation/h5p-server';
import { DBUser } from '../model/user/DBUser';

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

/**
 * Express middleware for checking body attributes.
 * Responds with a 400 statuscode if the attributes are undefined.
 * @param data attributes to check
 * @returns middleware for checking body attributes
 */
export function requireBody(...data: string[]) {
    return function (req: Request, res: Response, next: NextFunction): void {
        for (const field of data) {
            if (req.body[field] === undefined) {
                res.sendStatus(400);
                return;
            }
        }
        next();
    };
}

/**
 * Middleware for specifying the request attributes needed by the H5P library.
 * @param req Request object
 * @param _ Response object
 * @param next Next handler function
 */
export async function buildH5PRequest(
    req: Request,
    _: Response,
    next: NextFunction
): Promise<void> {
    if (req.session.userId === undefined) {
        req.user = {
            id: 'anonymous',
            canCreateRestricted: false,
            canInstallRecommended: false,
            canUpdateAndInstallLibraries: false,
            email: 'anonymous@loernwerk.de',
            name: 'Anonymous student',
            type: 'local',
        };
    } else {
        // TODO: We can greatly speed this up if we store name & email in the session - then we avoid a db query here (and this gets called a TON)
        const dbUser = await DBUser.findOneByOrFail({ id: req.session.userId });
        req.user = {
            id: dbUser.id.toString(),
            canCreateRestricted: true,
            canInstallRecommended: true,
            canUpdateAndInstallLibraries: true,
            email: dbUser.mail,
            name: dbUser.name,
            type: 'local',
        };
    }
    req.t = (errorId, replacements): string => {
        void replacements;
        return errorId;
    };
    next();
}

// Declaring session information
declare module 'express-session' {
    interface SessionData {
        userId?: number;
        isAdmin?: boolean;
    }
}

// Declaring additional request properties for H5P
declare module 'express-serve-static-core' {
    interface Request {
        user: IUser;
        t: (errorId: string, replacements: { [key: string]: string }) => string;
        language: string;
    }
}
