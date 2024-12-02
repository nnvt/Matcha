import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import userMiddleware from '../middlewares/user.middleware.js';
import imageMiddleware from '../middlewares/image.middleware.js';
import imageController from '../controllers/image.controller.js';

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
 *   name: Images
 *   description: All about /api/images
 */

router
  .use("/", authMiddleware.isAuth)
  .put("/profile/upload", imageController.uploadProfilePic)
  .put("/upload", imageController.uploadPic)
  .delete("/delete/:id", imageMiddleware.deletePic, imageController.deletePic);

export default router;
