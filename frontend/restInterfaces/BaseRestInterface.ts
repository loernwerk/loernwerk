import axios from 'axios';
import {
  LoernwerkError,
  LoernwerkErrorCodes,
} from '../../backend/loernwerkUtilities';

/**
 * Base Class responsible for the interaction with the server. Implements different types of HTTP-Methods.
 */
export abstract class BaseRestInterface {
  private static base_path = 'http://localhost:5000';

  /**
   * Sends GET request to backend
   * T generic type, to be replaced by object received from Webserver
   * @param url the url
   * @returns server response
   * @protected
   */
  protected static async get<T>(url: string): Promise<T> {
    return await this.executeWithErrorHandling<T>(axios.get<T>, url);
  }

  /**
   * Sends POST request to backend
   * T generic type, to be replaced by object received from Webserver
   * @param url the url
   * @param body the params
   * @returns server response
   * @protected
   */
  protected static async post<T>(url: string, body: unknown): Promise<T> {
    return await this.executeWithErrorHandling(axios.post<T>, url, body);
  }

  /**
   * Sends PUT request to backend
   * T generic type, to be replaced by object received from Webserver
   * @param url the url
   * @param body the params
   * @returns server response
   * @protected
   */
  protected static async put<T>(url: string, body: unknown): Promise<T> {
    return await this.executeWithErrorHandling(axios.put<T>, url, body);
  }

  /**
   * Sends DELETE request to backend
   * T generic type, to be replaced by object received from Webserver
   * @param url the url
   * @param body the params
   * @returns server response
   * @protected
   */
  protected static async delete(url: string, body: unknown): Promise<void> {
    return await this.executeWithErrorHandling(axios.delete, url, body);
  }

  /**
   * Sends PATCH request to backend
   * T generic type, to be replaced by object received from Webserver
   * @param url the url
   * @param body the params
   * @returns server response
   * @protected
   */
  protected static async patch(url: string, body: unknown): Promise<void> {
    return await this.executeWithErrorHandling(axios.patch, url, body);
  }

  /**
   * Implements the error handling for the BaseRestInterface methods
   * @param awaitable the method to check for errors
   * @param params the parameters of the given method
   * @private
   * @returns the return value of the given method
   */
  private static async executeWithErrorHandling<T>(
    awaitable,
    ...params
  ): Promise<T> {
    try {
      params[0] = `${this.base_path}${params[0]}`;
      const { data } = await awaitable(...params);
      return data;
    } catch (e) {
      const message = e.response?.data || e.message || 'Unknown error';
      const statusCode = e.response?.status || 500;

      throw new LoernwerkError(
        message,
        LoernwerkErrorCodes[statusCode] || LoernwerkErrorCodes.UNKNOWN
      );
    }
  }
}
