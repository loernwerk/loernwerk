import { BaseRestInterface } from './BaseRestInterface';
import {
  IContentMetadata,
  IEditorModel,
  IPlayerModel,
} from '@lumieducation/h5p-server';

interface H5POverviewItem {
  title: string;
  mainLibrary: string;
  contentId: string;
  usedSequences: string[];
}

/**
 * Implements communication with the Server concerning all H5P-requests
 */
export class H5PRestInterface extends BaseRestInterface {
  private static h5p_path = '/h5p/';

  /**
   * Sends a request to backend to add new H5P content
   * @param requestBody Request body supplied by the H5P editor
   * @param requestBody.library Library supplied by the H5P editor
   * @param requestBody.params Content parameters supplied by the H5P editor
   * @returns H5P response by the backend
   */
  public static async createH5PContent(requestBody: {
    library: string;
    params: unknown;
  }): Promise<{ contentId: string; metadata: IContentMetadata }> {
    return await this.put<{ contentId: string; metadata: IContentMetadata }>(
      this.h5p_path,
      { ...requestBody }
    );
  }

  /**
   * Sends a request to backend to get H5P content for editing
   * @param contentId Internal id of the content to edit
   * @param language Optional language to use
   * @returns H5P content for editing
   */
  public static async getH5PContent(
    contentId: string,
    language?: string
  ): Promise<IEditorModel> {
    return await this.get<IEditorModel>(
      `${this.h5p_path}${contentId}/edit?lang=${language}`
    );
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

  /**
   * Sends a request to get a list of all H5P content of the current user
   * @param userId Optional user to query for
   * @returns List of all h5p contents of the supplied user
   */
  public static async getH5PContentList(
    userId?: string
  ): Promise<H5POverviewItem[]> {
    if (userId) {
      return await this.get<H5POverviewItem[]>(
        `${this.h5p_path}list?id=${userId}`
      );
    } else {
      return await this.get<H5POverviewItem[]>(`${this.h5p_path}list`);
    }
  }

  /**
   * Sends a request to delete H5P content.
   * @param contentId id of the content to delete
   */
  public static async deleteH5PContent(contentId: string): Promise<void> {
    await this.delete(`${this.h5p_path}`, { id: contentId });
  }
}
