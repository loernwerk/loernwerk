import { BaseRestInterface } from './BaseRestInterface';
import { ISlide } from '../../model/slide/ISlide';
import { ISequence } from '../../model/sequence/ISequence';
import { ISequenceWithSlides } from '../../model/sequence/ISequenceWithSlides';

/**
 * Implements communication with the Server concerning all Sequence-requests
 */
export class SequenceRestInterface extends BaseRestInterface {
  private static sequence_path = '/sequence/';

  /**
   * Sends a request to backend to add a new Sequence
   * @param title the title of the sequence the user is trying to add
   * @returns code of the sequence
   */
  public static async addSequence(title: string): Promise<string> {
    return (
      await BaseRestInterface.put<{ code: string }>(this.sequence_path, {
        name: title,
      })
    ).code;
  }

  /**
   * Sends a request to backend to apply given changes to a sequence
   * @param sequence the sequence object
   * @returns confirmation
   */
  public static async updateSequence(
    sequence: Partial<ISequenceWithSlides>
  ): Promise<void> {
    return await BaseRestInterface.patch(this.sequence_path, sequence);
  }

  /**
   * Sends a request to backend to delete the given Sequence
   * @param sequenceCode the code of the sequence
   * @returns confirmation
   */
  public static async deleteSequence(sequenceCode: string): Promise<void> {
    return await BaseRestInterface.delete(this.sequence_path, {
      code: sequenceCode,
    });
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
      `${this.sequence_path}${sequenceCode}/edit`
    );
  }

  /**
   * Sends a request to backend to get all Sequences of the currently logged-in User
   * @returns requested sequences
   */
  public static async getOwnSequences(): Promise<ISequence[]> {
    return await BaseRestInterface.get<ISequence[]>(
      `${this.sequence_path}list`
    );
  }

  /**
   * Sends a request to backend to get all Sequences of the given User
   * @param userId the userId
   * @returns requested sequences
   */
  public static async getSequenceByUser(userId: number): Promise<ISequence[]> {
    return await BaseRestInterface.get<ISequence[]>(
      `${this.sequence_path}list/${userId}`
    );
  }

  /**
   * Sends a request to backend to get all Sequences which were shared with the currently logged in Account
   * @returns requested sequences
   */
  public static async getSequencesSharedWithYou(): Promise<ISequence[]> {
    return BaseRestInterface.get<ISequence[]>(
      `${this.sequence_path}list/shared`
    );
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
      `${this.sequence_path}${sequenceCode}/view`
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
      `${this.sequence_path}${sequenceCode}/view/${slideIndex}`
    );
  }
}
