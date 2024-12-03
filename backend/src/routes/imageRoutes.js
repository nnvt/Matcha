import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import userMiddleware from '../middleware/userMiddleware';
import imageMiddleware from '../middleware/imageMiddleware';
import imageController from '../controllers/imageController';

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
