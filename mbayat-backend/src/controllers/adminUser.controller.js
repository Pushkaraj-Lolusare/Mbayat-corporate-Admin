const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { adminUserService } = require("../services");
const pick = require("../utils/pick");

const addAdminUser = catchAsync(async (req, res) => {
  const add = await adminUserService.addAdminUser(req.body);
  res.status(httpStatus.OK).json(add);
});

const adminUserLists = catchAsync(async (req, res) => {
  const filter = pick(
    { ...req.query, ...{ role: "admin_user", status: "active" } },
    ["name", "status", "role"]
  );
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await adminUserService.adminUserLists(filter, options);
  res.send(result);
});

const editAdminUser = catchAsync(async (req, res) => {
  const edit = await adminUserService.editAdminUser(req.body);
  res.status(200).json(edit);
});

const deleteAdminUser = catchAsync(async (req, res) => {
  const remove = await adminUserService.deleteAdminUser(req.body);
  res.status(200).json(remove);
});

module.exports = {
  addAdminUser,
  adminUserLists,
  editAdminUser,
  deleteAdminUser,
};
