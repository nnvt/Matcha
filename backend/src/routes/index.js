import express from 'express';
import usersRoutes from './userRoutes.js';
import tagsRoutes from './tagsRoutes.js';
import imageRoutes from './imagesRoutes.js';
import historyRoutes from './historyRoutes.js';
import matchersRoutes from './matchersRoutes.js';
import chatRoutes from '../routes/chatRoutes.js';
import notificationsRoutes from './notificationRoutes.js';

const router = express.Router();

router
  .use("/users", usersRoutes)
  .use("/images", imageRoutes)
  .use("/tags", tagsRoutes)
  .use("/history", historyRoutes)
  .use("/matchers", matchersRoutes)
  .use("/chat", chatRoutes)
  .use("/notifications", notificationsRoutes);

export default router;
