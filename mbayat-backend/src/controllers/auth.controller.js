const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  if(user.status){
    res.status(httpStatus.OK).send(user);
  }
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const loginMasterAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const masterLogin = await authService.loginMaserAdmin(email, password);
  const tokens = await tokenService.generateAuthTokens(masterLogin);
  res.status(200).send({ user: masterLogin, tokens });
});

const confirmOTP = catchAsync(async (req, res) => {
  const confirmOtp = await authService.confirmOTP(req.body);
  res.send(confirmOtp);
});

const confirmOTPForRestPassword = catchAsync(async (req, res) => {
  const confirmOtp = await authService.confirmOTPForRestPassword(req.body);
  res.send(confirmOtp);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await authService.userForgotPassword(req.body);
  res.status(httpStatus.OK).send(resetPasswordToken);
});

const resetPassword = catchAsync(async (req, res) => {
  const reset = await authService.resetPassword(req.body);
  res.status(httpStatus.OK).send(reset);
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const getMysteryBoxSetting = catchAsync(async (req, res) => {
  const get = await authService.getMysteryBoxSetting(req.params.userId);
  res.status(httpStatus.OK).send(get);
});

const updateMysteryBoxSetting = catchAsync(async (req, res) => {
  const update = await authService.updateMysteryBoxSetting(req.body);
  res.status(httpStatus.OK).send(update);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  confirmOTP,
  loginMasterAdmin,
  confirmOTPForRestPassword,
  getMysteryBoxSetting,
  updateMysteryBoxSetting,
};
