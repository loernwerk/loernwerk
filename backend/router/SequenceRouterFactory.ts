import { Router } from 'express';
import { requireAdmin, requireBody, requireLogin } from '../loernwerkUtilities';
import { SequenceController } from '../controller/SequenceController';
import { RouterFactory } from './RouterFactory';

/**
 * Builds router for requests regarding sequence management.
 */
export class SequenceRouterFactory extends RouterFactory {
    /**
     * Builds router for sequence management
     * @returns built router
     */
    public buildRouter(): Router {
        const sequenceRouter = Router();

        sequenceRouter.put(
            '/',
            requireLogin,
            requireBody('name'),
            async (req, res) => {
                try {
                    const sequence = await SequenceController.createNewSequence(
                        req.body.name,
                        req.session.userId as number
                    );
                    res.status(201).json({ code: sequence.code });
                } catch (e) {
                    res.status(400).send(e.message);
                }
            }
        );

        sequenceRouter.patch(
            '/',
            requireLogin,
            requireBody('code'),
            async (req, res) => {
                //check if user has write access to this sequence or owns it
                try {
                    const sequence = await SequenceController.getSequenceByCode(
                        req.body.code
                    );
                    if (
                        req.session.userId != sequence.authorId &&
                        !sequence.writeAccess.includes(
                            req.session.userId as number
                        )
                    ) {
                        res.sendStatus(403);
                        return;
                    }
                } catch (e) {
                    res.status(404).send(e.message);
                }

                try {
                    await SequenceController.saveSequence(
                        req.body,
                        req.session.userId as number
                    );
                    res.sendStatus(204);
                } catch (e) {
                    res.status(400).send(e.message);
                }
            }
        );

        sequenceRouter.delete(
            '/',
            requireLogin,
            requireBody('code'),
            async (req, res) => {
                //check if user is owner or admin to delete the sequence
                try {
                    const sequence = await SequenceController.getSequenceByCode(
                        req.body.code
                    );
                    if (
                        req.session.userId != sequence.authorId &&
                        !req.session.isAdmin
                    ) {
                        res.sendStatus(403);
                        return;
                    }
                } catch (e) {
                    res.status(404).send(e.message);
                    return;
                }

                try {
                    await SequenceController.deleteSequence(
                        req.body.code,
                        req.session.userId as number
                    );
                    res.sendStatus(204);
                } catch (e) {
                    res.status(400).send(e.message);
                }
            }
        );

        sequenceRouter.get('/list', requireLogin, async (req, res) => {
            const sequences = await SequenceController.getSequencesOfUser(
                req.session.userId as number
            );
            res.status(200).json(sequences);
        });

        sequenceRouter.get('/list/shared', requireLogin, async (req, res) => {
            const sequences = await SequenceController.getSharedSequencesOfUser(
                req.session.userId as number
            );
            res.status(200).json(sequences);
        });

        sequenceRouter.get('/list/:id', requireAdmin, async (req, res) => {
            try {
                const sequences = await SequenceController.getSequencesOfUser(
                    parseInt(req.params.id)
                );
                res.status(200).json(sequences);
            } catch (e) {
                res.status(404).send(e.message);
            }
        });

        sequenceRouter.get('/:code/edit', requireLogin, async (req, res) => {
            //check if user has write/read access to this sequence, owns it or is Admin
            try {
                const sequence = await SequenceController.getSequenceWithSlides(
                    req.params.code
                );
                if (
                    req.session.userId != sequence.authorId &&
                    !sequence.writeAccess.includes(
                        req.session.userId as number
                    ) &&
                    !sequence.readAccess.includes(req.session.userId as number)
                ) {
                    res.sendStatus(403);
                    return;
                }
                res.status(200).json(sequence);
            } catch (e) {
                res.status(404).send(e.message);
            }
        });

        sequenceRouter.get('/:code/view', async (req, res) => {
            try {
                const sequence =
                    await SequenceController.getSequenceForExecution(
                        req.params.code
                    );
                res.status(200).json({
                    name: sequence.name,
                    authorId: sequence.authorId,
                    slideCount: sequence.slideCount,
                    code: sequence.code,
                });
            } catch (e) {
                res.status(404).send(e.message);
            }
        });

        sequenceRouter.get('/:code/view/certificate', async (req, res) => {
            try {
                const language = (req.query.language as string) || 'de';
                const pdf = await SequenceController.getCertificatePDF(
                    req.params.code,
                    language
                );
                let filename: string;
                switch (language) {
                    case 'de':
                        filename = 'Teilnahmezertifikat.pdf';
                        break;
                    case 'en':
                        filename = 'Certificate.pdf';
                        break;
                    default:
                        res.sendStatus(400);
                        return;
                }
                res.set(
                    'Content-Disposition',
                    `attachment;filename=${filename}`
                );
                res.status(200).send(pdf);
            } catch (e) {
                res.status(404).send(e.message);
            }
        });

        sequenceRouter.get('/:code/view/:slide', async (req, res) => {
            try {
                const slide = await SequenceController.getSequenceSlideByCode(
                    req.params.code,
                    parseInt(req.params.slide)
                );
                res.status(200).json(slide);
            } catch (e) {
                res.status(404).send(e.message);
            }
        });

        return sequenceRouter;
    }
}
