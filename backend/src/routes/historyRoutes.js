import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import userMiddleware from '../middleware/userMiddleware';
import historyController from '../controllers/historyController';

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
 *   name: History
 *   description: All about /api/history
 */

router
  .use("/", authMiddleware.isAuth, userMiddleware.completeInfos)
  .get("/visits", historyController.visitsHistory)
  .get("/user/viewers", historyController.loadViewers)
  .get("/user/followers/:id", userMiddleware.findUserById, historyController.loadFollowers)
  .get("/user/following/:id", userMiddleware.findUserById, historyController.loadFollowing);

export default router;
