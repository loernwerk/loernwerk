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
    UNINITIALIZED = 'UNINITIALIZED',
}
