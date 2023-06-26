import { ISlide } from '../slide/ISlide';
import { ISequence } from './ISequence';

/**
 * Extended sequence object with slides.
 */
export interface ISequenceWithSlides extends ISequence {
    /** All slides of this sequence */
    slides: ISlide[];
}
