import express from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@vm-kvitki/common-lib";
import { newController } from "../controllers/new-controller";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  newController
);

export { router as createChargeRouter };
