/**
 * Saves the type of a value for a certain configuration setting.
 */
export type ConfigType =
    | {
        /**
         * Type of the configuration setting
         */
        type: 'string' | 'boolean';
    }
    | {
        /**
         * Type of the configuration setting
         */
        type: 'number';
        /**
         * Whether the number option is unlimited or not
         */
        options: NumberOption;
    }
    | {
        /**
         * Type of the configuration setting
         */
        type: 'enum';
        /**
         * All possible options for this enum
         */
        options: string[];
    } | {
        type:'code';
        
        options: CodeOption
    };

export type NumberOption = 'limited' | 'unlimited';
export type CodeOption = {length: number, rollable: boolean};
