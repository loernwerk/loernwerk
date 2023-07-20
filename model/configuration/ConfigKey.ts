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
     * If the open_registration is available or not
     */
    REGISTRATION_TYPE = 'registration_type',
    /**
     * the code for the open registration
     */
    REGISTRATION_CODE = 'registration_code'
}
