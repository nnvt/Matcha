import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import userMiddleware from '../middlewares/userMiddleware.js';
import historyController from '../controllers/historyController.js';

const router = express.Router();

router
  .use("/", authMiddleware.isAuth, userMiddleware.completeInfos)
  .get("/visits", historyController.visitsHistory)
  .get("/user/viewers", historyController.loadViewers)
  .get("/user/followers/:id", userMiddleware.findUserById, historyController.loadFollowers)
  .get("/user/following/:id", userMiddleware.findUserById, historyController.loadFollowing);

export default router;
