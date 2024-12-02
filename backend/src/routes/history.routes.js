import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import userMiddleware from '../middlewares/user.middleware.js';
import historyController from '../controllers/history.controller.js';

const router = express.Router();

router
  .use("/", authMiddleware.isAuth, userMiddleware.completeInfos)
  .get("/visits", historyController.visitsHistory)
  .get("/user/viewers", historyController.loadViewers)
  .get("/user/followers/:id", userMiddleware.findUserById, historyController.loadFollowers)
  .get("/user/following/:id", userMiddleware.findUserById, historyController.loadFollowing);

export default router;
