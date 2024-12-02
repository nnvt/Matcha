import express from 'express';
import authMiddleware from "../middleware/authMiddleware.js";
import userMiddleware from "../middleware/userMiddleware.js";
import notificationsController from "../controllers/notificationController.js";
import notificationsMiddleware from "../middleware/notificationMiddleware.js";

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
  .use("/", authMiddleware.isAuth)
  .get("/list", notificationsController.loadNotifs)  // Load notifications for the connected user
  .patch("/read/:id", notificationsMiddleware.validateNotif, notificationsController.read)  // Mark a specific notification as read
  .patch("/read", notificationsController.readAll)  // Mark all notifications as read
  .delete("/delete/:id", notificationsMiddleware.validateNotif, notificationsController.delete)  // Delete a specific notification
  .delete("/delete", notificationsController.deleteAll);  // Delete all notifications

export default router;