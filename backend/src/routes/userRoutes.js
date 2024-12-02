import express from 'express';
import authMiddleware from "../middlewares/authMiddleware";
import userMiddleware from '../middlewares/userMiddleware';
import userController from '../controllers/userController';

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
 *   name: Users
 *   description: All about /api/users
 */

router
  // Protect routes with authMiddleware
  .use("/find", authMiddleware.isAuth, userMiddleware.completeInfos)
  .use("/edit", authMiddleware.isAuth, userMiddleware.completeInfos)

  // Get user data
  .get("/find/suggestions", userController.browsing)
  .get("/find/profile", userController.profileInfos)
  .get("/find/user/id/:id", userMiddleware.findUserById, userController.findUserById)
  .get("/find/user/username/:username", userMiddleware.findUserByUsername, userController.findUserByUsername)
  .get("/verify/isinfoscompleted", authMiddleware.isAuth, userController.isinfoscompleted)
  .get("/find/black/list", userController.blacklist)
  .get("/get/status/:id", authMiddleware.isAuth, userMiddleware.completeInfos, userController.getStatus)

  // Post requests for user registration, login, and Google auth
  .post("/verify/token", userController.verifyToken)
  .post("/register", userMiddleware.register, userController.register)
  .post("/register/google", userMiddleware.registerGoogle, userController.registerGoogle)
  .post("/login", userMiddleware.login, userController.login)
  .post("/logout", authMiddleware.isAuth, userController.logout)
  .post("/auth/google", userMiddleware.authGoogle, userController.authGoogle)

  // Other routes
  .post("/edit", userController.editUser)  // For editing user info

export default router;
