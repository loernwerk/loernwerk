/**
 * Different types of configuration settings.
 */
export enum ConfigKey {
    /**
     * Maximum number of sequences a user can create
     */
    MAX_SEQUENCES_PER_USER = 'max_sequences_per_user',
    /**
     * Maximum number of slides a sequence can contain
     */
    MAX_SLIDES_PER_SEQUENCE = 'max_slides_per_sequence',
    /**
     * if the open_registration is available or not
     */
    REGISTRATION_TYPE = 'registration_type',
    /**
     * the code for the open registration
     */
    REGISTRATION_CODES = 'registration_codes',
    /**
     * if the registration codes expire after use or not
     */
    REGISTRATION_CODES_EXPIRES_AFTER_USE = 'registration_codes_expires_after_use'
}
