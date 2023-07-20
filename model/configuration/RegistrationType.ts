/**
 * Holds the registration types
 */
export enum RegistrationType {
    /**
     * Everyone can sign up
     */
    OPEN = 'open',
    /**
     * Sign up is possible through a invite code
     */
    INVITE = 'invite',
    /**
     * only admins can create codes
     */
    CLOSED = 'closed',
}
