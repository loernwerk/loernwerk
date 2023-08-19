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

/**
 * Error codes for LoernwerkError
 */
export enum LoernwerkErrorCodes {
    /**
     * The entity already exists
     */
    ALREADY_EXISTS = 'ALREADY_EXISTS',
    /**
     * Insufficient information was supplied to achieve execution
     */
    INSUFFICENT_INFORMATION = 'INSUFFICENT_INFORMATION',
    /**
     * Information given is ambiguous
     */
    AMBIGUOUS_INFORMATION = 'AMBIGUOUS_INFORMATION',
    /**
     * Entity queried couldn't be found
     */
    NOT_FOUND = 'NOT_FOUND',
    /**
     * The request data was invalid
     */
    BAD_REQUEST = 'BAD_REQUEST',
    /**
     * The user isn't authorized
     */
    UNAUTHORIZED = 'UNAUTHORIZED',
    /**
     * The user isn't allowed to access this object
     */
    FORBIDDEN = 'FORBIDDEN',
    /**
     * Unknown return type
     */
    UNKNOWN = 'UNKNOWN',
    /**
     * The entity wasn't initialized prior
     */
    UNINITIALIZED = 'UNINITIALIZED',
    /**
     * Given parameter was invalid
     */
    INVALID_PARAMETER = 'INVALID_PARAMETER',
}

export enum LoernwerkErrorMessages {
    INSUFFICENT_USER_DETAILS = 'INSUFFICENT_USER_DETAILS',
    MAIL_ALREADY_EXISTS = 'MAIL_ALREADY_EXISTS',
    USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
    AMBIGUOUS_USER_DETAILS = 'AMBIGUOUS_USER_DETAILS',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    PASSWORD_DOES_NOT_SATISFY_REQUIREMENTS = 'PASSWORD_DOES_NOT_SATISFY_REQUIREMENTS',
    USERNAME_DOES_NOT_SATISFY_REQUIREMENTS = 'USERNAME_DOES_NOT_SATISFY_REQUIREMENTS',
    MAIL_DOES_NOT_SATISFY_REQUIREMENTS = 'MAIL_DOES_NOT_SATISFY_REQUIREMENTS',
}
