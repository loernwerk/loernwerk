import axios, { AxiosError } from 'axios';
import {
  LoernwerkError,
  LoernwerkErrorCodes,
} from '../../../model/loernwerkError';

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
    try {
      return (
        await axios.get<T>(this.getBaseURL() + url, { withCredentials: true })
      ).data;
    } catch (e) {
      throw this.transformError(e as Error);
    }
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
    try {
      return (
        await axios.post<T>(this.getBaseURL() + url, body, {
          withCredentials: true,
        })
      ).data;
    } catch (e) {
      throw this.transformError(e as Error);
    }
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
    try {
      return (
        await axios.put<T>(this.getBaseURL() + url, body, {
          withCredentials: true,
        })
      ).data;
    } catch (e) {
      throw this.transformError(e as Error);
    }
  }

  /**
   * Sends DELETE request to backend
   * @typeParam T generic type, to be replaced by object received from Webserver
   * @param url the url
   * @param body the params
   * @protected
   */
  protected static async delete(url: string, body: unknown): Promise<void> {
    try {
      await axios.delete(this.getBaseURL() + url, {
        withCredentials: true,
        data: body,
      });
    } catch (e) {
      throw this.transformError(e as Error);
    }
  }

  /**
   * Sends PATCH request to backend
   * @typeParam T generic type, to be replaced by object received from Webserver
   * @param url the url
   * @param body the params
   * @returns server response
   * @protected
   */
  protected static async patch<T>(url: string, body: unknown): Promise<T> {
    try {
      return (
        await axios.patch<T>(this.getBaseURL() + url, body, {
          withCredentials: true,
        })
      ).data;
    } catch (e) {
      throw this.transformError(e as Error);
    }
  }

  /**
   * Returns the backend base URL.
   * @returns Base URL
   */
  protected static getBaseURL(): string {
    return window.location.hostname.includes('localhost') ||
      window.location.hostname.includes('127.0.0.1')
      ? 'http://localhost:5000/api'
      : window.location.origin + '/api';
  }

  /**
   * Transforms an error from a request to a LoernwerkError. Will parse AxiosError if provided.
   * @param error Error to transform
   * @returns Transformed LoernwerkError
   * @private
   */
  private static transformError(error: Error): LoernwerkError {
    let message;
    let statusCode = 500;
    if (error instanceof AxiosError) {
      message = error.response?.data || error.message || 'Unknown error';
      statusCode = error.response?.status || 500;
    }
    const errors: { [statusCode: number]: LoernwerkErrorCodes } = {
      404: LoernwerkErrorCodes.NOT_FOUND,
      400: LoernwerkErrorCodes.BAD_REQUEST,
      401: LoernwerkErrorCodes.UNAUTHORIZED,
      403: LoernwerkErrorCodes.FORBIDDEN,
    };
    return new LoernwerkError(
      message,
      errors[statusCode] || LoernwerkErrorCodes.UNKNOWN
    );
  }
}
