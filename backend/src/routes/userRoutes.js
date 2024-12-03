import express from 'express';
import authMiddleware from "../middleware/authMiddleware";
import userMiddleware from '../middleware/userMiddleware';
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
  .get("/find/suggestions", userController.browsing)
  .get("/find/profile", userController.profileInfos)
  .get("/find/user/id/:id", userMiddleware.findUserById, userController.findUserById)
  .get("/find/user/username/:username", userMiddleware.findUserByUsername, userController.findUserByUsername)
  .get("/verify/isinfoscompleted", authMiddleware.isAuth, userController.isinfoscompleted)
  .get("/find/black/list", userController.blacklist)
  .get("/get/status/:id", authMiddleware.isAuth, userMiddleware.completeInfos, userController.getStatus)
  .post("/verify/token", userController.verifyToken)
  .post("/register", userMiddleware.register, userController.register)
  .post("/register/google", userMiddleware.registerGoogle, userController.registerGoogle)
  .post("/login", userMiddleware.login, userController.login)
  .post("/logout", authMiddleware.isAuth, userController.logout)
  .post("/auth/google", userMiddleware.authGoogle, userController.authGoogle)
  .post("/resetpassword", userMiddleware.resetPassword, userController.resetPassword)
  .post("/search", authMiddleware.isAuth, userMiddleware.completeInfos, userController.search)
  .put("/like/:id", authMiddleware.isAuth, userMiddleware.completeInfos, userMiddleware.like, userMiddleware.likedBack, userController.like)
  .put("/unlike/:id", authMiddleware.isAuth, userMiddleware.completeInfos, userMiddleware.unlike, userMiddleware.isMatch, userController.unlike)
  .put("/block/:blocked", authMiddleware.isAuth, userMiddleware.completeInfos, userMiddleware.block, userController.block)
  .put("/unblock/:unblocked", authMiddleware.isAuth, userMiddleware.completeInfos, userMiddleware.unblock, userController.unblock)
  .put("/report/:id", authMiddleware.isAuth, userMiddleware.completeInfos, userMiddleware.report, userController.report)
  .patch("/verify", userMiddleware.verify, userController.verify)
  .patch("/newpassword", userMiddleware.newPassword, userController.newPassword)
  .patch("/completeinfos", authMiddleware.isAuth, userMiddleware.isProfileCompleted, userController.completeInfos)
  .patch("/edit/informations", userMiddleware.editInfos, userController.editInfos)
  .patch("/edit/password", userMiddleware.changepassword, userController.changepassword)
  .patch("/edit/location", userMiddleware.editLocation, userController.editLocation)
  .patch("/update/status", authMiddleware.isAuth, userMiddleware.completeInfos, userController.setStatus);

export default router;
