import { BaseRestInterface } from './BaseRestInterface';

// replace all strings with type ConfigKey, just string to make eslint happy
/**
 * Implements communication with the Server concerning all Config-requests
 */
class ConfigRestInterface extends BaseRestInterface {

  /**
   * To be implemented
   * @param key the ConfigKey
   */
    public static async getValue(key: string): Promise<unknown> {
    key = 'empty';
    return;
  }

  /**
   * To be implemented
   * @param key the ConfigKey
   * @param value the value
   */
  public static async setValue(key: string, value: unknown): Promise<void> {
    key = 'empty';
    value = 'empty';
    return;
  }

  /**
   * To be implemented
   */
  public static async getAllValues(): Promise<Record<string, unknown>> {
    return;
  }
}
