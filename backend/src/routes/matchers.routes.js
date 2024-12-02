import express from 'express';
import authMiddleware from "../middlewares/auth.middleware";
import userMiddleware from "../middlewares/user.middleware";
import matchersController from "../controllers/matchers.controller.js";

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
