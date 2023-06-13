const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { planService } = require("../services");

const createPlan = catchAsync(async (req, res) => {
  const create = await planService.createPlan(req.body);
  res.status(httpStatus.OK).json(create);
});

const getPlanLists = catchAsync(async (req, res) => {
  const get = await planService.getPlanLists(req.body);
  res.status(httpStatus.OK).json(get);
});

const getPlanById = catchAsync(async (req, res) => {
  const get = await planService.getPlanById(req.params.planId);
  res.status(httpStatus.OK).json(get);
});

const updatePlan = catchAsync(async (req, res) => {
  const update = await planService.updatePlan(req.body);
  res.status(httpStatus.OK).json(update);
});

module.exports = {
  createPlan,
  getPlanLists,
  getPlanById,
  updatePlan,
};
