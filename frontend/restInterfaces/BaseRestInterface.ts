import axios from 'axios';

/**
 * Base Class responsible for the interaction with the server. Implements different types of HTTP-Methods.
 */
export abstract class BaseRestInterface {
  /**
   * Sends GET request to backend
   * @param url the url
   * @returns server response
   * @protected
   */
  protected static async get<T>(url: string): Promise<T> {
    const { data } = await axios.get<T>(url);
    return data;
  }

  /**
   * Sends POST request to backend
   * @param url the url
   * @param body the params
   * @returns server response
   * @protected
   */
  protected static async post<T>(url: string, body: unknown): Promise<T> {
    const { data } = await axios.post<T>(url, body);
    return data;
  }

  /**
   * Sends PUT request to backend
   * @param url the url
   * @param body the params
   * @returns server response
   * @protected
   */
  protected static async put<T>(url: string, body: unknown): Promise<T> {
    const { data } = await axios.put<T>(url, body);
    return data;
  }

  /**
   * Sends DELETE request to backend
   * @param url the url
   * @param body the params
   * @returns server response
   * @protected
   */
  protected static async delete(url: string, body: unknown): Promise<void> {
    const { data } = await axios.delete(url, body);
    return data;
  }

  /**
   * Sends PATCH request to backend
   * @param url the url
   * @param body the params
   * @returns server response
   * @protected
   */
  protected static async patch(url: string, body: unknown): Promise<void> {
    const { data } = await axios.patch(url, body);
    return data;
  }
}
