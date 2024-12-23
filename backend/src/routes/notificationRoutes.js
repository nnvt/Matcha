import express from 'express';
import authMiddleware from "../middleware/authMiddleware";
import userMiddleware from "../middleware/userMiddleware";
import notificationsController from "../controllers/notificationController";
import notificationsMiddleware from "../middleware/notificationMiddleware";

const router = express.Router();

router
  .use("/", authMiddleware.isAuth)
  .get("/list", notificationsController.loadNotifs)  // Load notifications for the connected user
  .patch("/read/:id", notificationsMiddleware.validateNotif, notificationsController.read)  // Mark a specific notification as read
  .patch("/read", notificationsController.readAll)  // Mark all notifications as read
  .delete("/delete/:id", notificationsMiddleware.validateNotif, notificationsController.delete)  // Delete a specific notification
  .delete("/delete", notificationsController.deleteAll);  // Delete all notifications

export default router;