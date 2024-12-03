import express from 'express';
import authMiddleware from "../middleware/authMiddleware";
import userMiddleware from "../middleware/userMiddleware";
import matchersController from "../controllers/matchersController.js";

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
 *   name: Matchers
 *   description: All about /api/matchers
 */

router
  .use("/", authMiddleware.isAuth, userMiddleware.completeInfos)
  .get("/list", matchersController.loadMatchers);

export default router;
