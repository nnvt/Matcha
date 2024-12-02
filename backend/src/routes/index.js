import express from 'express';
import usersRoutes from './user.routes.js';
import tagsRoutes from './tags.routes.js';
import imageRoutes from './images.routes.js';
import historyRoutes from './history.routes.js';
import matchersRoutes from './matchers.routes.js';
import chatRoutes from '../routes/chat.routes.js';
import notificationsRoutes from './notification.routes.js';

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
