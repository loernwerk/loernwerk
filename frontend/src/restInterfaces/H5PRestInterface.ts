import { BaseRestInterface } from './BaseRestInterface';
import { IContentMetadata } from '@lumieducation/h5p-server';
import {
  IEditorModel,
  IPlayerModel,
} from '@lumieducation/h5p-server/build/src/types';

/**
 * Implements communication with the Server concerning all H5P-requests
 */
export class H5PRestInterface extends BaseRestInterface {
  private static h5p_path = '/h5p/';

  /**
   * Sends a request to backend to add new H5P content
   * @param sequenceCode Sequence code of the sequence that this content belongs to
   * @param requestBody Request body supplied by the H5P editor
   * @param requestBody.library Library supplied by the H5P editor
   * @param requestBody.params Content parameters supplied by the H5P editor
   * @returns H5P response by the backend
   */
  public static async createH5PContent(
    sequenceCode: string,
    requestBody: { library: string; params: unknown }
  ): Promise<{ contentId: string; metadata: IContentMetadata }> {
    return await this.put<{ contentId: string; metadata: IContentMetadata }>(
      this.h5p_path,
      { ...requestBody, sequence: sequenceCode }
    );
  }

  /**
   * Sends a request to backend to get H5P content for editing
   * @param contentId Internal id of the content to edit
   * @returns H5P content for editing
   */
  public static async getH5PContent(contentId: string): Promise<IEditorModel> {
    return await this.get<IEditorModel>(`${this.h5p_path}${contentId}/edit`);
  }

  /**
   * Sends a request to update existing H5P content
   * @param contentId Internal id of the content to edit
   * @param requestBody New content data
   * @param requestBody.library Library supplied by the H5P editor
   * @param requestBody.params Content parameters supplied by the H5P editor
   * @returns H5P response by the backend
   */
  public static async editH5PContent(
    contentId: string,
    requestBody: { library: string; params: unknown }
  ): Promise<{ contentId: string; metadata: IContentMetadata }> {
    return await this.patch<{ contentId: string; metadata: IContentMetadata }>(
      `${this.h5p_path}${contentId}/edit`,
      requestBody
    );
  }

  /**
   * Sends a request to get H5P content for viewing / execution
   * @param contentId Internal id of the content to view
   * @returns H5P content for viewing
   */
  public static async getH5PContentForExecution(
    contentId: string
  ): Promise<IPlayerModel> {
    return await this.get<IPlayerModel>(`${this.h5p_path}${contentId}/view`);
  }
}
