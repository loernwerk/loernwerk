import { NextFunction, Request, Response } from 'express';
import i18next, { TFunction } from 'i18next';
import i18nextFsBackend from 'i18next-fs-backend';
import i18nextHttpMiddleware from 'i18next-http-middleware';
import { join } from 'path';
import { H5PUser } from './h5p/H5PPermissionSystem';

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
 * @param res Return object, not needed
 * @param next Next handler function
 */
export function buildH5PRequest(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (req.session.userId === undefined) {
        req.user = {
            id: 'anonymous',
            email: 'anonymous@loernwerk.de',
            name: 'Anonymous student',
            type: 'local',
            isAdmin: false,
            isLoggedIn: false,
            userId: -1,
        };
    } else {
        req.user = {
            id: req.session.userId?.toString(),
            email: req.session.email || '',
            name: req.session.username || '',
            type: 'local',
            isAdmin: req.session.isAdmin || false,
            isLoggedIn: true,
            userId: req.session.userId,
        };
    }
    if (translationFunction !== null) {
        req.t = translationFunction;
    } else {
        // Fallback translation function
        req.t = fallbackTranslation as TFunction<
            string,
            {
                [key: string]: string;
            }
        >;
    }

    next();
}

/**
 *
 * @param errorId Id of the error
 * @param replacements Replacements for the error message
 * @returns The translation
 */
function fallbackTranslation(
    errorId: string,
    replacements: { [key: string]: string }
): string {
    void replacements;
    return errorId;
}

let translationFunction: TFunction | null = null;

/**
 * Initializes a translation function for the H5P library.
 */
export async function buildH5Pi18n(): Promise<void> {
    translationFunction = await i18next
        .use(i18nextFsBackend)
        .use(i18nextHttpMiddleware.LanguageDetector)
        .init({
            backend: {
                loadPath: join(
                    __dirname,
                    '/node_modules/@lumieducation/h5p-server/build/assets/translations/{{ns}}/{{lng}}.json'
                ),
            },
            defaultNS: 'server',
            fallbackLng: 'de',
            ns: [
                'client',
                'copyright-semantics',
                'hub',
                'library-metadata',
                'metadata-semantics',
                'server',
            ],
            preload: ['de'],
        });
}

// Declaring session information
declare module 'express-session' {
    interface SessionData {
        // ID of the user
        userId?: number;
        // Indicating whether the user is an admin
        isAdmin?: boolean;
        // Username of the user
        username?: string;
        // Email of the user
        email?: string;
    }
}

// Declaring additional request properties for H5P
declare module 'express-serve-static-core' {
    interface Request {
        // User object required by H5P library.
        user: H5PUser;
        // Translation function for error messages. Name forced by H5P library.
        t: TFunction;
        // Language used by the user.
        language: string;
    }
}
