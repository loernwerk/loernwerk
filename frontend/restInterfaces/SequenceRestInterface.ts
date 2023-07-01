import { BaseRestInterface } from './BaseRestInterface';
import { ISlide } from '../../model/slide/ISlide';
import { ISequence } from '../../model/sequence/ISequence';
import { ISequenceWithSlides } from '../../model/sequence/ISequenceWithSlides';

/**
 * Implements communication with the Server concerning all Sequence-requests
 */
export class SequenceRestInterface extends BaseRestInterface {
  /**
   * Sends a request to backend to add a new Sequence
   * @param title the title of the sequence the user is trying to add
   * @returns code of the sequence
   */
  public static async addSequence(title: string): Promise<string> {
    return await BaseRestInterface.put<string>('/sequence/', title);
  }

  /**
   * Sends a request to backend to apply given changes to a sequence
   * @param sequence the sequence object
   * @returns confirmation
   */
  public static async updateSequence(
    sequence: Partial<ISequenceWithSlides>
  ): Promise<void> {
    return await BaseRestInterface.patch('/sequence/', sequence);
  }

  /**
   * Sends a request to backend to delete the given Sequence
   * @param sequenceCode the code of the sequence
   * @returns confirmation
   */
  public static async deleteSequence(sequenceCode: string): Promise<void> {
    return await BaseRestInterface.delete('/sequence/', sequenceCode);
  }

  /**
   * Sends a request to backend to get a Sequence by given Code
   * @param sequenceCode the code of the sequence
   * @returns requested sequence
   */
  public static async getSequence(
    sequenceCode: string
  ): Promise<ISequenceWithSlides> {
    return BaseRestInterface.get<ISequenceWithSlides>(
      `/sequence/${sequenceCode}/edit`
    );
  }

  /**
   * Sends a request to backend to get all Sequences of the currently logged-in User
   * @returns requested sequences
   */
  public static async getOwnSequences(): Promise<ISequence[]> {
    return await BaseRestInterface.get<ISequence[]>('/sequence/list');
  }

  /**
   * Sends a request to backend to get all Sequences of the given User
   * @param userId the userId
   * @returns requested sequences
   */
  public static async getSequenceByUser(userId: number): Promise<ISequence[]> {
    return await BaseRestInterface.get<ISequence[]>(`/sequence/list/${userId}`);
  }

  /**
   * Sends a request to backend to get all public Sequences
   * @returns requested sequences
   */
  public static async getPublicSequences(): Promise<ISequence[]> {
    return await BaseRestInterface.get<ISequence[]>('/sequence/list/public');
  }

  /**
   * Sends a request to backend to get all reported Sequences
   * @returns requested sequences
   */
  public static async getReportedSequences(): Promise<ISequence[]> {
    return await BaseRestInterface.get<ISequence[]>('/sequence/list/reported');
  }

  /**
   * Sends a request to backend to get all Sequences which were shared with the currently logged in Account
   * @returns requested sequences
   */
  public static async getSequencesSharedWithYou(): Promise<ISequence[]> {
    return BaseRestInterface.get<ISequence[]>('/sequence/list/shared');
  }

  /**
   * Sends a request to backend to get relevant Information for participants
   * @param sequenceCode the code of the sequence the data is requested of
   * @returns requested data
   */
  public static async getMetadataForStudent(
    sequenceCode: string
  ): Promise<Partial<ISequence>> {
    return await BaseRestInterface.get<Partial<ISequence>>(
      `/sequence/${sequenceCode}/view`
    );
  }

  /**
   * Sends a request to backend to get a single Slide
   * @param sequenceCode the code of the sequence the slide is a part of
   * @param slideIndex the index of the slide
   * @returns requested slide
   */
  public static async getSlide(
    sequenceCode: string,
    slideIndex: number
  ): Promise<ISlide> {
    return await BaseRestInterface.get<ISlide>(
      `/sequence/${sequenceCode}/view/${slideIndex}`
    );
  }

  /**
   * Sends a request to backend to report a given Sequence
   * @param sequenceCode the code of the sequence which the user tries to report
   * @returns confirmation
   */
  public static async reportSequence(sequenceCode: string): Promise<void> {
    return await BaseRestInterface.post('/sequence/report', sequenceCode);
  }
}
