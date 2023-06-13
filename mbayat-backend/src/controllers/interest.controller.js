const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const { interestService } = require("../services");

const createInterest = catchAsync(async (req, res) => {
  const create = await interestService.createInterest(req.body);
  res.status(httpStatus.OK).json(create);
});

const getListOfInterest = catchAsync(async (req, res) => {
  const filter = pick({ ...req.query, ...{ status: "active" } }, ["status"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "fetchType"]);
  const result = await interestService.queryInterest(filter, options);
  res.status(httpStatus.OK).send(result);
});

const updateInterest = catchAsync(async (req, res) => {
  const update = await interestService.updateInterest(req.body);
  res.status(httpStatus.OK).json(update);
});

const removeInterest = catchAsync(async (req, res) => {
  const remove = await interestService.removeInterest(req.body);
  res.status(httpStatus.OK).json(remove);
});

const userByInterest = catchAsync(async (req, res) => {
  const getUsers = await interestService.userByInterest(
    req.params.interestId,
    req.query
  );
  res.status(httpStatus.OK).json(getUsers);
});

const createSubInterest = catchAsync(async (req, res) => {
  const create = await interestService.createSubInterest(req.body);
  res.status(httpStatus.OK).json(create);
});

const getSubInterestById = catchAsync(async (req, res) => {
  const getLists = await interestService.getSubInterestById(
    req.params.interestId
  );
  res.status(httpStatus.OK).json(getLists);
});

module.exports = {
  createInterest,
  getListOfInterest,
  updateInterest,
  removeInterest,
  userByInterest,
  createSubInterest,
  getSubInterestById,
};
