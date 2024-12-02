import express from 'express';
import chatController from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import userMiddleware from '../middleware/userMiddleware.js';

// Swagger documentation components and tags
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
 *   name: Chat
 *   description: All about /api/chat
 */

const router = express.Router();

router
  .use("/", authMiddleware.isAuth, userMiddleware.completeInfos)
  .get("/messages/:id", chatController.loadMessages);

export default router;
