import express from 'express';
import tagController from '../controllers/tagController'

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: 'http'
 *       scheme: 'bearer'
 *       bearerFormat: 'JWT'
 *
 * tags:
 *   name: Notifications
 *   description: All about /api/notifications
 */

router
  .get('/list', tagController.tagsList);

export default router;