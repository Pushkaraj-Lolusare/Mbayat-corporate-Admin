const express = require("express");
const auth = require("../../middlewares/auth");
const { planController } = require("../../controllers");

const router = express.Router();

router.post("/create-plan", auth(), planController.createPlan);

router.get("/get-plan-lists", planController.getPlanLists);

router.get("/get-plan-by-id/:planId", planController.getPlanById);

router.post("/update-plan", planController.updatePlan);

module.exports = router;
