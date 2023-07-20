/**
 * Holds the registration types
 */
export enum RegistrationType {
    /**
     * Everyone can sign up
     */
    PUBLIC = 'open',
    /**
     * Sign up is possible through a invite code
     */
    INVITATION = 'invite',
    /**
     * only admins can create codes
     */
    CLOSED = 'closed',
}
