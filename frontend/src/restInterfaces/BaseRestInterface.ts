import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import {
  LoernwerkError,
  LoernwerkErrorCodes,
} from '../../../backend/loernwerkUtilities';

/**
 * Base Class responsible for the interaction with the server. Implements different types of HTTP-Methods.
 */
export abstract class BaseRestInterface {
  /**
   * Sends GET request to backend
   * @typeParam T generic type, to be replaced by object received from Webserver
   * @param url the url
   * @returns server response
   * @protected
   */
  protected static async get<T>(url: string): Promise<T> {
    return (await this.executeWithErrorHandling<T>(axios.get<T>, url)) as T;
  }

  /**
   * Sends POST request to backend
   * @typeParam T generic type, to be replaced by object received from Webserver
   * @param url the url
   * @param body the params
   * @returns server response
   * @protected
   */
  protected static async post<T>(url: string, body: unknown): Promise<T> {
    return (await this.executeWithErrorHandling(axios.post<T>, url, body)) as T;
  }

  /**
   * Sends PUT request to backend
   * @typeParam T generic type, to be replaced by object received from Webserver
   * @param url the url
   * @param body the params
   * @returns server response
   * @protected
   */
  protected static async put<T>(url: string, body: unknown): Promise<T> {
    return (await this.executeWithErrorHandling(axios.put<T>, url, body)) as T;
  }

  /**
   * Sends DELETE request to backend
   * @typeParam T generic type, to be replaced by object received from Webserver
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
   * @typeParam T generic type, to be replaced by object received from Webserver
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
   * @param awaitable the axios method to check for errors
   * @param url URL to query
   * @param body Body to send with the request
   * @private
   * @returns the return value of the given method
   */
  private static async executeWithErrorHandling<T>(
    // prettier-ignore
    awaitable: ((url: string, body?: unknown, config?: AxiosRequestConfig) => Promise<{ data: T }>) | ((url: string, config?: AxiosRequestConfig) => Promise<{ data: T }>),
    url: string,
    body?: unknown
  ): Promise<T> {
    try {
      const backendHost =
        window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('127.0.0.1')
          ? 'http://localhost:5000'
          : window.location.origin;

      const { data } = await awaitable(`${backendHost}${url}/api`, {
        data: body,
        withCredentials: true,
      });
      return data;
    } catch (e) {
      let message;
      let statusCode = 500;
      if (e instanceof AxiosError) {
        message = e.response?.data || e.message || 'Unknown error';
        statusCode = e.response?.status || 500;
      }
      const errors: { [statusCode: number]: LoernwerkErrorCodes } = {
        404: LoernwerkErrorCodes.NOT_FOUND,
        400: LoernwerkErrorCodes.BAD_REQUEST,
        401: LoernwerkErrorCodes.UNAUTHORIZED,
        403: LoernwerkErrorCodes.FORBIDDEN,
      };
      throw new LoernwerkError(
        message,
        errors[statusCode] || LoernwerkErrorCodes.UNKNOWN
      );
    }
  }
}
