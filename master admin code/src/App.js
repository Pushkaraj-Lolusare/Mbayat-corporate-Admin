import React from "react";
import { connect } from "react-redux";
import { Route, Switch ,withRouter} from "react-router-dom";
import Login from "./screens/Login";
import dashboard from "./screens/Dashbord/Dashbord";
import NavbarMenu from "./components/NavbarMenu";
import forgotpassword from "./screens/Auth/ForgotPassword";
import AuthRoute from './util/AuthRoute';

// needed components
import users from './screens/User/User'
import interest from './screens/Interest/Interset'
import EditUser from "./screens/User/editUser";
import AdminUser from "./screens/AdminUser/adminUser";
import AddAdminUser from "./screens/AdminUser/addAdminUser";
import EditAdminUser from "./screens/AdminUser/editAdminUser";
import OrderList from "./screens/Order/OrderList";
import Subscription from "./screens/Subscription/Subscription";
import CreateSubscription from "./screens/Subscription/CreateSubscription";
import UserInInterest from "./screens/Interest/UserInInterest";
import Payment from "./screens/Payment/Payment";
import Gift from "./screens/Gift/Gift";
import Rating from "./screens/Rating/Rating";
import AboutUs from "./screens/AboutUs/AboutUs";
import Privacy from "./screens/Privacy/Privacy";
import Terms from "./screens/Terms/Terms";
import Faq from "./screens/faq/Faq";
import SubscribedUser from "./screens/User/SubscribedUser";
import VendorUser from "./screens/User/vendorUser";
import AddVendor from "./screens/User/AddVendor";
import EditVendor from "./screens/User/EditVendor";
import MysteryBoxSetting from "./screens/MysteryBox/MysteryBoxSetting";
import SubInterest from "./screens/Interest/SubInterest";
import OrderDetails from "./screens/Order/OrderDetails";
import EditSubscription from "./screens/Subscription/EditSubscription";
import MysteryBoxOrderList from "./screens/Order/MysteryBoxOrderLists";
import CorporateOrders from "./screens/Order/CorporateOrders";
import ViewUserDetails from "./screens/User/UserDetails";

window.__DEV__ = true;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
    };
  }
  render() {

    let res = window.location.pathname;

    // let baseUrl = process.env.PUBLIC_URL;
    // baseUrl = baseUrl.split("/");
    // res = res.split("/");
    // res = res.length > 0 ? res[baseUrl.length] : "/";
    // res = res ? res : "/";
    const activeKey1 = res;
    return (
      <div id="wrapper">
        {
        activeKey1 === "/login" ||
        activeKey1 === "/registration" ||
        activeKey1 === "/lockscreen" ||
        activeKey1 === "/forgotpassword" ||
        activeKey1 === "/page404" ||
        activeKey1 === "/page403" ||
        activeKey1 === "/page500" ||
        activeKey1 === "/page503" ||
        activeKey1 === "/maintanance" ? (
            <Switch>
              {/* <Route exact path={`${process.env.PUBLIC_URL}`} component={Login} /> */}
              <Route
                exact
                path="/login"
                component={Login}
              />
              <Route
                exact
                path="/forgotpassword"
                component={forgotpassword}
              />
            </Switch>
        ) : (
          <>
              <NavbarMenu history={this.props.history} activeKey={activeKey1} />
              <div id="main-content">
                <Switch>
                  <Route>
                    <AuthRoute>
                      <Route
                          exact
                          path="/"
                          component={dashboard}
                      />
                      <Route
                          exact
                          path="/dashboard"
                          component={dashboard}
                      />
                      <Route
                          exact
                          path="/registered-users"
                          component={users}
                      />
                      <Route
                          exact
                          path="/subscribed-users"
                          component={SubscribedUser}
                      />
                      <Route
                          exact
                          path="/edit-user/:userId"
                          component={EditUser}
                      ></Route>
                      <Route
                          exact
                          path="/interest"
                          component={interest}
                      />
                      <Route
                          exact
                          path="/sub-interest/:interestId"
                          component={SubInterest}
                      />
                      <Route
                          exact
                          path="/user-in-interest/:interestId/:type?"
                          component={UserInInterest}
                      ></Route>
                      <Route
                          exact
                          path="/admin-users"
                          component={AdminUser}
                      ></Route>

                      <Route
                          exact
                          path="/vendor-users"
                          component={VendorUser}
                      ></Route>

                      <Route
                        exact
                        path="/view-user-details/:userId"
                        component={ViewUserDetails}>
                      </Route>

                      <Route
                          exact
                          path="/add-vendor"
                          component={AddVendor}
                      ></Route>
                      <Route
                        exact
                        path="/add-admin-user"
                        component={AddAdminUser}
                      ></Route>

                      <Route
                          exact
                          path="/edit-vendor/:vendorId"
                          component={EditVendor}
                      ></Route>
                      <Route
                          exact
                          path="/edit-admin-user/:userId"
                          component={EditAdminUser}
                      ></Route>
                      <Route
                          exact
                          path="/subscription"
                          component={Subscription}
                      ></Route>
                      <Route
                          exact
                          path="/create-subscription"
                          component={CreateSubscription}
                      ></Route>

                      <Route
                          exact
                          path="/edit-subscription/:planId"
                          component={EditSubscription}
                      ></Route>
                      <Route
                          exact
                          path="/mysterybox-setting"
                          component={MysteryBoxSetting}
                      ></Route>
                      <Route
                          exact
                          path="/order-list"
                          component={OrderList}
                      ></Route>
                      <Route
                          exact
                          path="/mystery-box-orders-list"
                          component={MysteryBoxOrderList}
                      ></Route>
                      <Route
                          exact
                          path="/corporate-orders-list"
                          component={CorporateOrders}
                      ></Route>
                      <Route
                          exact
                          path="/order-details/:orderId"
                          component={OrderDetails}
                      ></Route>
                      <Route
                          exact
                          path="/payment-list"
                          component={Payment}
                      ></Route>
                      <Route
                          exact
                          path="/gift-list"
                          component={Gift}
                      ></Route>
                      <Route
                          exact
                          path="/rating-list"
                          component={Rating}
                      ></Route>
                      <Route
                          exact
                          path="/about-us"
                          component={AboutUs}
                      ></Route>
                      <Route
                          exact
                          path="/privacy-policy"
                          component={Privacy}
                      ></Route>
                      <Route
                          exact
                          path="/terms-and-condition"
                          component={Terms}
                      ></Route>
                      <Route
                          exact
                          path="/faqs"
                          component={Faq}
                      ></Route>
                      </AuthRoute>
                  </Route>
                </Switch>
              </div>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ loginReducer }) => ({
  isLoggedin: loginReducer.isLoggedin,
});

export default withRouter(connect(mapStateToProps, {})(App));
