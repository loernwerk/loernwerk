import { ConfigKey } from '../../../model/configuration/ConfigKey';
import { BaseRestInterface } from './BaseRestInterface';

/**
 * Implements communication with the Server concerning all configuration of the plattform
 */
export class ConfigRestInterface extends BaseRestInterface {
  private static config_path = '/config/';

  /**
   * Sends a request to backend to get a configuration value
   * @param key configuration of which the value is requested
   * @returns value of the given configuration
   */
  public static async getValue(key: ConfigKey): Promise<unknown> {
    return (
      await BaseRestInterface.get<{ value: unknown }>(
        `${this.config_path}${key}`
      )
    ).value;
  }

  /**
   * Sends a request to backend to set a given configuration setting
   * @param key key of the configuration which should be changed
   * @param value value of the configuration which should be changed
   */
  public static async setValue(key: ConfigKey, value: unknown): Promise<void> {
    await BaseRestInterface.patch(`${this.config_path}${key}`, {
      value: value,
    });
  }

  /**
   * Sends a request to backend to roll a given configuration setting
   * @param key the key of the configuration which should be rolled
   */
  public static async rollValue(key: ConfigKey): Promise<void> {
    await BaseRestInterface.patch(
      `${this.config_path}${key}`.concat('?roll="true"'),
      {
        value: 'empty', //remove require in backend?
      }
    );
  }

  /**
   * Sends a request to backend to get all current configuration values
   * @returns all configuration values
   */
  public static async getAllValue(): Promise<Record<ConfigKey, unknown>> {
    return await BaseRestInterface.get<Record<ConfigKey, unknown>>(
      this.config_path
    );
  }
}
