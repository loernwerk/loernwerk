import { RouterFactory } from './RouterFactory';
import { Router } from 'express';
import {
    buildH5PRequest,
    requireBody,
    requireLogin,
} from '../loernwerkUtilities';
import { H5PServer } from '../h5p/H5PServer';
import { IEditorModel } from '@lumieducation/h5p-server';

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
            }
        );

        h5pRouter.get(
            '/:contentId/edit',
            requireLogin,
            buildH5PRequest,
            async (req, res) => {
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
                            canCreateRestricted: false,
                            canInstallRecommended: false,
                            canUpdateAndInstallLibraries: false,
                            email: 'anonymous@loernwerk.de',
                            name: 'Anonymous student',
                            type: 'local',
                        },
                        req.language ?? 'en'
                    );
                res.json(content);
            } catch (e) {
                res.status(500).send((e as Error).message);
            }
        });

        return h5pRouter;
    }
}
