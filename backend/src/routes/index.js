import express from 'express';
import usersRoutes from './userRoutes';
import tagsRoutes from './tagsRoutes';
import imageRoutes from './imageRoutes';
import historyRoutes from './historyRoutes';
import matchersRoutes from './matchersRoutes';
// import chatRoutes from '../routes/chatRoutes';
import notificationsRoutes from './notificationRoutes';

const router = express.Router();

router
  .use("/users", usersRoutes)
  .use("/images", imageRoutes)
  .use("/tags", tagsRoutes)
  .use("/history", historyRoutes)
  .use("/matchers", matchersRoutes)
  // .use("/chat", chatRoutes)
  .use("/notifications", notificationsRoutes);

export default router;
