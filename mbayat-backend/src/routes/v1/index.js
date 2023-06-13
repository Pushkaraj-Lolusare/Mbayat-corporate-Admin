const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const interestRoute = require("./interest.route");
const adminUserRoute = require("./adminUser.route");
const wishlistRoute = require("./wishlist.route");
const notificationRoute = require("./notification.route");
const orderRoute = require("./order.route");
const paymentRoute = require("./payment.route");
const giftRoute = require("./gift.route");
const ratingRoute = require("./rating.route");
const cartRoute = require("./cart.route");
const planRoute = require("./plan.route");
const subscriptionRoute = require("./subscription.route");

//  all vendor route
const vendorAuth = require("./vendor/auth.route");
const vendorHome = require("./vendor/home.route");
const productRoute = require("./product.route");
const vendorOrder = require("./vendor/order.route");

const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/interest",
    route: interestRoute,
  },
  {
    path: "/adminUser",
    route: adminUserRoute,
  },
  {
    path: "/wishlist",
    route: wishlistRoute,
  },
  {
    path: "/notification",
    route: notificationRoute,
  },
  {
    path: "/order",
    route: orderRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/gift",
    route: giftRoute,
  },
  {
    path: "/rating",
    route: ratingRoute,
  },
  {
    path: "/vendor-auth",
    route: vendorAuth,
  },
  {
    path: "/vendor-home",
    route: vendorHome,
  },
  {
    path: "/product",
    route: productRoute,
  },
  {
    path: "/vendor-order",
    route: vendorOrder,
  },
  {
    path: "/cart",
    route: cartRoute,
  },
  {
    path: "/plan",
    route: planRoute,
  },
  {
    path: "/subscription",
    route: subscriptionRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
