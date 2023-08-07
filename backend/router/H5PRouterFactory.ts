import { RouterFactory } from './RouterFactory';
import { Router } from 'express';
import {
    buildH5PRequest,
    requireBody,
    requireLogin,
} from '../loernwerkUtilities';
import { H5PServer } from '../h5p/H5PServer';
import { IEditorModel } from '@lumieducation/h5p-server';
import { H5PUser } from '../h5p/H5PPermissionSystem';
import { DBH5PContent, DBH5PContentUsedBy } from '../../model/h5p/DBH5PContent';

/**
 * Builds router for requests regarding H5P management
 */
export class H5PRouterFactory extends RouterFactory {
    /**
     * Builds router for H5P management
     * @returns built router
     */
    public buildRouter(): Router {
        const h5pRouter = Router();

        h5pRouter.put(
            '/',
            requireLogin,
            requireBody('params', 'library'),
            buildH5PRequest,
            async (req, res) => {
                // Deeper checks of request body
                if (
                    req.body.params.params === undefined ||
                    req.body.params.metadata === undefined
                ) {
                    res.sendStatus(400);
                    return;
                }

                try {
                    const h5pObject = await H5PServer.getInstance()
                        .getH5PEditor()
                        .saveOrUpdateContentReturnMetaData(
                            undefined,
                            req.body.params.params,
                            req.body.params.metadata,
                            req.body.library,
                            req.user
                        );

                    res.json({
                        contentId: h5pObject.id,
                        metadata: h5pObject.metadata,
                    });
                } catch (e) {
                    res.status(400).send(e.message);
                    return;
                }
            }
        );

        h5pRouter.patch(
            '/:contentId/edit',
            requireLogin,
            requireBody('params', 'library'),
            buildH5PRequest,
            async (req, res) => {
                // Deeper checks of request body
                if (
                    req.body.params.params === undefined ||
                    req.body.params.metadata === undefined
                ) {
                    res.sendStatus(400);
                    return;
                }

                try {
                    const h5pObject = await H5PServer.getInstance()
                        .getH5PEditor()
                        .saveOrUpdateContentReturnMetaData(
                            req.params.contentId.toString(),
                            req.body.params.params,
                            req.body.params.metadata,
                            req.body.library,
                            req.user
                        );
                    res.json({
                        contentId: h5pObject.id,
                        metadata: h5pObject.metadata,
                    });
                } catch (e) {
                    res.status(400).send(e.message);
                    return;
                }
            }
        );

        h5pRouter.get(
            '/:contentId/edit',
            requireLogin,
            buildH5PRequest,
            async (req, res) => {
                try {
                    const editorModel = (await H5PServer.getInstance()
                        .getH5PEditor()
                        .render(
                            req.params.contentId === 'undefined'
                                ? undefined
                                : req.params.contentId,
                            req.language ?? 'en',
                            req.user
                        )) as IEditorModel;

                    if (req.params.contentId === 'undefined') {
                        res.json(editorModel);
                    } else {
                        const content = await H5PServer.getInstance()
                            .getH5PEditor()
                            .getContent(req.params.contentId);
                        res.json({
                            ...editorModel,
                            library: content.library,
                            metadata: content.params.metadata,
                            params: content.params.params,
                        });
                    }
                } catch (e) {
                    res.status(400).send(e.message);
                    return;
                }
            }
        );

        h5pRouter.get('/:contentId/view', async (req, res) => {
            try {
                const content = await H5PServer.getInstance()
                    .getH5PPlayer()
                    .render(
                        req.params.contentId,
                        {
                            id: 'anonymous',
                            email: 'anonymous@loernwerk.de',
                            name: 'Anonymous student',
                            type: 'local',
                            isAdmin: false,
                            isLoggedIn: false,
                            userId: -1,
                        } as H5PUser,
                        req.language ?? 'en'
                    );
                res.json(content);
            } catch (e) {
                res.status(500).send((e as Error).message);
            }
        });

        h5pRouter.get('/list', requireLogin, async (req, res) => {
            let userId = req.session.userId as number;
            if (req.query.id && req.session.isAdmin) {
                userId = parseInt(req.query.id as string);
            }

            const userToQuery: H5PUser = {
                id: userId.toString(),
                userId: userId,
                isAdmin: req.session.isAdmin || false,
                isLoggedIn: true,
                email: req.session.email as string,
                name: req.session.username as string,
                type: 'local',
            };

            try {
                const contents = await H5PServer.getInstance()
                    .getH5PEditor()
                    .contentManager.listContent(userToQuery);
                const result: {
                    title: string;
                    contentId: string;
                    mainLibrary: string;
                    usedSequences: string[];
                }[] = [];

                for (const content of contents) {
                    const metadata = await H5PServer.getInstance()
                        .getH5PEditor()
                        .contentManager.getContentMetadata(
                            content,
                            userToQuery
                        );
                    const usedSequences = await DBH5PContentUsedBy.findBy({
                        h5pContentId: content,
                    });
                    result.push({
                        title: metadata.title,
                        contentId: content,
                        mainLibrary: metadata.mainLibrary,
                        usedSequences: usedSequences.map(
                            (sequence) => sequence.sequenceCode
                        ),
                    });
                }

                res.json(result);
            } catch (e) {
                res.status(500).send((e as Error).message);
            }
        });

        h5pRouter.delete(
            '/',
            requireLogin,
            requireBody('id'),
            buildH5PRequest,
            async (req, res) => {
                // Check for ownership
                const content = await DBH5PContent.findOne({
                    where: { h5pContentId: req.body.id },
                    select: ['owner'],
                });
                if (!content) {
                    res.status(404).send();
                    return;
                }
                if (
                    content.owner !== req.session.userId &&
                    !req.session.isAdmin
                ) {
                    res.status(403).send();
                    return;
                }

                // Check if content used anywhere
                const usages = await DBH5PContentUsedBy.find({
                    where: { h5pContentId: req.body.id },
                    select: ['sequenceCode'],
                });
                if (usages.length !== 0) {
                    res.status(400).send();
                    return;
                }

                try {
                    await H5PServer.getInstance()
                        .getH5PEditor()
                        .contentManager.deleteContent(req.body.id, req.user);
                    res.status(204).send();
                } catch (e) {
                    res.status(500).send((e as Error).message);
                }
            }
        );

        return h5pRouter;
    }
}
