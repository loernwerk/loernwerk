import { Router } from 'express';

/**
 * Base class of Router-Factories.
 */
export abstract class RouterFactory {
    /**
     * Builds the Router, has to be overwriten by child classes
     * @returns built router
     */
    public abstract buildRouter(): Router;
}
