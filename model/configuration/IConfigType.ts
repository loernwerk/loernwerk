/**
 * Saves the type of a value for a certain configuration setting.
 */
export interface IConfigType {
    /**
     * Describes the type of the value
     */
    type: 'string' | 'number' | 'boolean' | 'enum';

    /**
     * If "type" is an enum, this variable saves valid options of the enum
     */
    options?: string[];
}
