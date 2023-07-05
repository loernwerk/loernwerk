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
                } catch {
                    res.sendStatus(400);
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
                } catch {
                    res.sendStatus(404);
                }

                try {
                    await SequenceController.saveSequence(req.body);
                    res.sendStatus(204);
                } catch {
                    res.sendStatus(400);
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
                } catch {
                    res.sendStatus(404);
                }

                try {
                    await SequenceController.deleteSequence(req.body.code);
                    res.sendStatus(204);
                } catch {
                    res.sendStatus(400);
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
            } catch {
                res.sendStatus(404);
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
            } catch {
                res.sendStatus(404);
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
            } catch {
                res.sendStatus(404);
            }
        });

        sequenceRouter.get('/:code/view/:slide', async (req, res) => {
            try {
                const slide = await SequenceController.getSequenceSlideByCode(
                    req.params.code,
                    parseInt(req.params.slide)
                );
                res.status(200).json(slide);
            } catch {
                res.sendStatus(404);
            }
        });

        return sequenceRouter;
    }
}
