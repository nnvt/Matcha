import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import userMiddleware from '../middlewares/userMiddleware.js';
import imageMiddleware from '../middlewares/imageMiddleware.js';
import imageController from '../controllers/imageController.js';

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
