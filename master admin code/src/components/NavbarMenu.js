import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Dropdown, Nav, Toast} from "react-bootstrap";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {
    onPressDashbord,
    onPressDashbordChild,
    onPressThemeColor,
    onPressGeneralSetting,
    onPressNotification,
    onPressEqualizer,
    onPressSideMenuToggle,
    onPressMenuProfileDropdown,
    onPressSideMenuTab,
    tostMessageLoad,
} from "../actions";
import Logo from "../assets/images/admin-logo.png";
import LogoWhite from "../assets/images/admin-logo.png";
import UserImage from "../assets/images/user-100.png";
import Avatar4 from "../assets/images/xs/avatar4.jpg";
import Avatar5 from "../assets/images/xs/avatar5.jpg";
import Avatar2 from "../assets/images/xs/avatar2.jpg";
import Avatar1 from "../assets/images/xs/avatar1.jpg";
import Avatar3 from "../assets/images/xs/avatar3.jpg";
import verifyToken from "../services/authServices/tokenService";
import Cookies from 'universal-cookie'

class NavbarMenu extends React.Component {

    constructor(props) {
        super(props);

        const cookies = new Cookies();

        this.state = {
            linkupdate: false,
            userDetails: cookies.get('user') ? cookies.get('user') : {},
            permission: cookies.get('user')?.permissions || [],
        };
        console.log(this.state.permission);
    }

    async componentDidMount() {
        let res = window.location.pathname;
        res = res.split("/");
        res = res.length > 4 ? res[4] : "/";
        const {activeKey} = this.props;
        this.activeMenutabwhenNavigate(activeKey);

        await verifyToken();

    }

    getModulePermission = (moduleName) => {
        let permission = {};
        let userPermission = this.state.permission;
        permission = userPermission.find((value) => value[moduleName]);
        return permission;
    }

    logOut = () => {
        const cookies = new Cookies();
        cookies.remove('user-token');
        cookies.remove('user');
        this.props.history.push('/login');
    }

    activeMenutabwhenNavigate(activeKey) {
        if (
            activeKey === "" ||
            activeKey === "/dashboard"
        ) {
            this.activeMenutabContainer("dashboradContainer");
        } else if (
            activeKey === "/registered-users"
        ) {
            this.activeMenutabContainer("userContainer");
        } else if (
            activeKey === "/interest" ||
            activeKey === "/user-in-interest"
        ) {
            this.activeMenutabContainer('interestContainer');
        } else if (
            activeKey === "/admin-users" ||
            activeKey === "/add-admin-user" ||
            activeKey === "/edit-admin-user"
        ) {
            this.activeMenutabContainer('adminUsersContainer');
        }else if(
            activeKey === "/subscription" ||
            activeKey === "/create-subscription"
        ){
            this.activeMenutabContainer('subscriptionContainer');
        }
        else if(
            activeKey === "/order-list"
        ){
            this.activeMenutabContainer('orderContainer');
        }else if(
            activeKey === "/rating-list"
        ){
            this.activeMenutabContainer('ratingContainer');
        }else if(
            activeKey === "/payment-list"
        ){
            this.activeMenutabContainer('paymentContainer');
        }else if(
            activeKey === "/gift-list"
        ){
            this.activeMenutabContainer('giftContainer');
        }else if(
            activeKey === "/about-us" ||
            activeKey === "/privacy-policy" ||
            activeKey === "/terms-and-condition" ||
            activeKey === "/faqs"
        ){
            this.activeMenutabContainer('WebContainer');
        }else if(
            activeKey === "/subscribed-users"
        ){
            this.activeMenutabContainer('subUserContainer');
        }else if(
            activeKey === "/vendor-users"
        ){
            this.activeMenutabContainer('vendorUsersContainer');
        }else if(
            activeKey === "/mysterybox-setting"
        ){
            this.activeMenutabContainer('mysteryBoxContainer');
        }


    }

    // componentWillReceiveProps(){
    //   this.setState({
    //     linkupdate:!this.state.linkupdate
    //   })
    // }

    activeMenutabContainer(id) {
        var parents = document.getElementById("main-menu");
        var activeMenu = document.getElementById(id);

        for (let index = 0; index < parents.children.length; index++) {
            if (parents.children[index].id !== id) {
                parents.children[index].classList.remove("active");
                // parents.children[index].children[1].classList.remove("in");
            }
        }
        setTimeout(() => {
            activeMenu.classList.toggle("active");

            if(activeMenu.children[1]){
                activeMenu.children[1].classList.toggle("in");
            }
        }, 10);
    }

    render() {
        const {
            themeColor,
            sideMenuTab,
            activeKey,
            toggleNotification,
        } = this.props;
        document.body.classList.add(themeColor);

        return (
            <div>
                <nav className="navbar navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="navbar-btn">
                            <button
                                className="btn-toggle-offcanvas"
                                onClick={() => {
                                    this.props.onPressSideMenuToggle();
                                }}
                            >
                                <i className="lnr lnr-menu fa fa-bars"></i>
                            </button>
                        </div>

                        <div className="navbar-brand d-flex">
                            <img
                                src={
                                    document.body.classList.contains("full-dark")
                                        ? LogoWhite
                                        : Logo
                                }
                                alt="Lucid Logo"
                                className="img-responsive logo"
                            /> <h4 className="ml-3 mt-1">Mbayat</h4>
                        </div>

                        <div className="navbar-right">

                            <div id="navbar-menu">
                                <ul className="nav navbar-nav">

                                    <li>
                                        <a href="#" className="icon-menu" onClick={() => {
                                            this.logOut()
                                        }}>
                                            <i className="icon-login"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>

                <div id="left-sidebar" className="sidebar" style={{zIndex: 9}}>
                    <div className="sidebar-scroll">
                        <div className="user-account">
                            <img
                                src={UserImage}
                                className="rounded-circle user-photo"
                                alt="User Profile Picture"
                            />
                            <Dropdown>
                                <span>Welcome,</span>
                                <Dropdown.Toggle
                                    variant="none"
                                    as="a"
                                    id="dropdown-basic"
                                    className="user-name"
                                >
                                    <strong>{this.state.userDetails?.first_name}</strong>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="dropdown-menu-right account">
                                    {/*<Dropdown.Item href="profilev2page">*/}
                                    {/*    <i className="icon-user"></i>My Profile*/}
                                    {/*</Dropdown.Item>*/}
                                    {/*<li className="divider"></li>*/}
                                    <Dropdown.Item href="#" onClick={() => {
                                        this.logOut()
                                    }}>
                                        {" "}
                                        <i className="icon-power"></i>Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a
                                    className={sideMenuTab[0] ? "nav-link active" : "nav-link"}
                                    data-toggle="tab"
                                    onClick={() => {
                                        this.props.onPressSideMenuTab(0);
                                    }}
                                >
                                    Menu
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content p-l-0 p-r-0">
                            <div
                                className={sideMenuTab[0] ? "tab-pane active show" : "tab-pane"}
                                id="menu"
                            >
                                <Nav id="left-sidebar-nav" className="sidebar-nav">
                                    <ul id="main-menu" className="metismenu">
                                        {
                                            this.state.userDetails.role === 'admin_user' ?
                                                <>
                                                    {
                                                        this.getModulePermission('dashboard')?.dashboard.view && (
                                                            <li className="" id="dashboradContainer">

                                                                <Link className={activeKey === "dashboard" ? "active" : ""}
                                                                      to="/dashboard"
                                                                      onClick={(e) => {
                                                                          this.activeMenutabContainer("dashboradContainer");
                                                                      }}>
                                                                    <i className="icon-home"></i> <span>Dashboard</span>
                                                                </Link>

                                                            </li>
                                                        )
                                                    }
                                                    {
                                                        this.getModulePermission('registeredUser')?.registeredUser.view && (
                                                            <li className="" id="userContainer">
                                                                <Link
                                                                    className={activeKey === "registered-users" ? "active" : ""}
                                                                    to="/registered-users"
                                                                    onClick={(e) => {
                                                                        this.activeMenutabContainer("userContainer");
                                                                    }}>
                                                                    <i className="icon-user"></i>
                                                                    <span>Users</span>
                                                                </Link>
                                                            </li>
                                                        )
                                                    }

                                                    {
                                                        this.getModulePermission('interest')?.interest.view && (
                                                            <li className="" id="interestContainer">

                                                                <Link className={activeKey === "interest" ? "active" : ""}
                                                                      to="/interest" onClick={(e) => {
                                                                    this.activeMenutabContainer("interestContainer");
                                                                }}>
                                                                    <i className="icon-like"></i> <span>Interest</span>
                                                                </Link>

                                                            </li>
                                                        )
                                                    }
                                                    {
                                                        this.getModulePermission('adminUser')?.adminUser.view && (
                                                            <li className="" id="adminUsersContainer">
                                                                <Link
                                                                    className={activeKey === "admin-users" ? "active" : ""}
                                                                    to="/admin-users" onClick={(e) => {
                                                                    this.activeMenutabContainer("adminUsersContainer");
                                                                }}>
                                                                    <i className="icon-users"></i> <span>Admin Users</span>
                                                                </Link>
                                                            </li>
                                                        )
                                                    }
                                                    {
                                                        this.getModulePermission('subscription')?.subscription.view && (
                                                            <li className="" id="subscriptionContainer">

                                                                <Link
                                                                    className={activeKey === "subscription" ? "active" : ""}
                                                                    to="/subscription" onClick={(e) => {
                                                                    this.activeMenutabContainer("subscriptionContainer");
                                                                }}>
                                                                    <i className="icon-wallet"></i>
                                                                    <span>Subscriptions</span>
                                                                </Link>

                                                            </li>
                                                        )
                                                    }
                                                </>
                                                :
                                                <>
                                                    <li className="" id="dashboradContainer">

                                                        <Link className={activeKey === "dashboard" ? "active" : ""}
                                                              to="/dashboard"
                                                              onClick={(e) => {
                                                                  this.activeMenutabContainer("dashboradContainer");
                                                              }}>
                                                            <i className="icon-home"></i> <span>Dashboard</span>
                                                        </Link>
                                                    </li>
                                                    <li className="" id="userContainer">
                                                        <Link
                                                            className={activeKey === "registered-users" ? "active" : ""}
                                                            to="/registered-users"
                                                            onClick={(e) => {
                                                                this.activeMenutabContainer("userContainer");
                                                            }}>
                                                            <i className="icon-user"></i> <span>Users </span>
                                                        </Link>
                                                    </li>

                                                    {/*<li className="" id="subUserContainer">*/}
                                                    {/*    <Link*/}
                                                    {/*        className={activeKey === "subscribed-users" ? "active" : ""}*/}
                                                    {/*        to="/subscribed-users"*/}
                                                    {/*        onClick={(e) => {*/}
                                                    {/*            this.activeMenutabContainer("subUserContainer");*/}
                                                    {/*        }}>*/}
                                                    {/*        <i className="icon-users"></i> <span>Subscribed Users </span>*/}
                                                    {/*    </Link>*/}
                                                    {/*</li>*/}
                                                    <li className="" id="interestContainer">

                                                        <Link className={activeKey === "interest" ? "active" : ""}
                                                              to="/interest" onClick={(e) => {
                                                            this.activeMenutabContainer("interestContainer");
                                                        }}>
                                                            <i className="icon-like"></i> <span>Interest</span>
                                                        </Link>

                                                    </li>

                                                    <li className="" id="adminUsersContainer">
                                                        <Link className={activeKey === "admin-users" ? "active" : ""}
                                                              to="/admin-users" onClick={(e) => {
                                                            this.activeMenutabContainer("adminUsersContainer");
                                                        }}>
                                                            <i className="icon-users"></i> <span>Admin Users</span>
                                                        </Link>
                                                    </li>

                                                    {/*<li className="" id="vendorUsersContainer">*/}
                                                    {/*    <Link className={activeKey === "vendor-users" ? "active" : ""}*/}
                                                    {/*          to="/vendor-users" onClick={(e) => {*/}
                                                    {/*        this.activeMenutabContainer("vendorUsersContainer");*/}
                                                    {/*    }}>*/}
                                                    {/*        <i className="icon-users"></i> <span>Vendor Users</span>*/}
                                                    {/*    </Link>*/}
                                                    {/*</li>*/}

                                                    <li className="" id="subscriptionContainer">

                                                        <Link className={activeKey === "subscription" ? "active" : ""}
                                                              to="/subscription" onClick={(e) => {
                                                            this.activeMenutabContainer("subscriptionContainer");
                                                        }}>
                                                            <i className="icon-wallet"></i> <span>Subscriptions</span>
                                                        </Link>
                                                    </li>

                                                    <li className="" id="mysteryBoxContainer">
                                                        <Link className={activeKey === "mysterybox-setting" ? "active" : ""}
                                                              to="/mysterybox-setting" onClick={(e) => {
                                                            this.activeMenutabContainer("mysteryBoxContainer");
                                                        }}>
                                                            <i className="icon-bag"></i> <span>MysteryBox Setting</span>
                                                        </Link>
                                                    </li>

                                                    {/*<li className="" id="orderContainer">*/}
                                                    {/*    <Link className={activeKey === "order-list" ? "active" : ""}*/}
                                                    {/*          to="/order-list" onClick={(e) => {*/}
                                                    {/*        this.activeMenutabContainer("orderContainer");*/}
                                                    {/*    }}>*/}
                                                    {/*        <i className="icon-docs"></i> <span>Orders</span>*/}
                                                    {/*    </Link>*/}
                                                    {/*</li>*/}

                                                    <li id="orderContainer" className="">
                                                        <a
                                                            href="#!"
                                                            className="has-arrow"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                this.activeMenutabContainer("orderContainer");
                                                            }}
                                                        >
                                                            <i className="icon-grid"></i> <span>Orders</span>
                                                        </a>
                                                        <ul className="collapse">
                                                            <li
                                                                className={activeKey === "order-list" ? "active" : ""}
                                                                onClick={() => {}}
                                                            >
                                                                <Link to="/order-list">Individual Orders</Link>
                                                            </li>
                                                            <li
                                                                className={activeKey === "mystery-box-orders-list" ? "active" : ""}
                                                                onClick={() => {}}
                                                            >
                                                                <Link to="/mystery-box-orders-list">MysteryBox Orders</Link>
                                                            </li>
                                                            <li
                                                                className={activeKey === "corporate-orders-list" ? "active" : ""}
                                                                onClick={() => {}}
                                                            >
                                                                <Link to="/corporate-orders-list">Corporate Orders</Link>
                                                            </li>
                                                        </ul>
                                                    </li>

                                                    <li className="" id="paymentContainer">
                                                        <Link className={activeKey === "payment-list" ? "active" : ""}
                                                              to="/payment-list" onClick={(e) => {
                                                            this.activeMenutabContainer("paymentContainer");
                                                        }}>
                                                            <i className="icon-credit-card"></i> <span>Payment</span>
                                                        </Link>
                                                    </li>
                                                    <li className="" id="giftContainer">
                                                        <Link className={activeKey === "gift-list" ? "active" : ""}
                                                              to="/gift-list" onClick={(e) => {
                                                            this.activeMenutabContainer("giftContainer");
                                                        }}>
                                                            <i className="icon-cup"></i> <span>Gift</span>
                                                        </Link>
                                                    </li>
                                                    <li className="" id="ratingContainer">
                                                        <Link className={activeKey === "rating-list" ? "active" : ""}
                                                              to="/rating-list" onClick={(e) => {
                                                            this.activeMenutabContainer("ratingContainer");
                                                        }}>
                                                            <i className="icon-star"></i> <span>Rating </span>
                                                        </Link>
                                                    </li>
                                                    <li id="WebContainer" className="">
                                                        <a
                                                            href="#!"
                                                            className="has-arrow"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                this.activeMenutabContainer("WebContainer");
                                                            }}
                                                        >
                                                            <i className="icon-grid"></i> <span>Website Content</span>
                                                        </a>
                                                        <ul className="collapse">
                                                            <li
                                                                className={activeKey === "about-us" ? "active" : ""}
                                                                onClick={() => {}}
                                                            >
                                                                <Link to="/about-us">About Us</Link>
                                                            </li>
                                                            <li
                                                                className={activeKey === "privacy-policy" ? "active" : ""}
                                                                onClick={() => {}}
                                                            >
                                                                <Link to="/privacy-policy">Privacy Policy</Link>
                                                            </li>
                                                            <li
                                                                className={activeKey === "terms-and-condition" ? "active" : ""}
                                                                onClick={() => {}}
                                                            >
                                                                <Link to="/terms-and-condition">Terms And Condition</Link>
                                                            </li>
                                                            <li
                                                                className={activeKey === "faq" ? "active" : ""}
                                                                onClick={() => {}}
                                                            >
                                                                <Link to="/faqs">FAQ</Link>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </>
                                        }

                                    </ul>
                                </Nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

NavbarMenu.propTypes = {
    addClassactive: PropTypes.array.isRequired,
    addClassactiveChild: PropTypes.array.isRequired,
    addClassactiveChildApp: PropTypes.array.isRequired,
    addClassactiveChildFM: PropTypes.array.isRequired,
    addClassactiveChildBlog: PropTypes.array.isRequired,
    addClassactiveChildUI: PropTypes.array.isRequired,
    addClassactiveChildWidgets: PropTypes.array.isRequired,
    addClassactiveChildAuth: PropTypes.array.isRequired,
    addClassactiveChildPages: PropTypes.array.isRequired,
    addClassactiveChildForms: PropTypes.array.isRequired,
    addClassactiveChildTables: PropTypes.array.isRequired,
    addClassactiveChildChart: PropTypes.array.isRequired,
    addClassactiveChildMaps: PropTypes.array.isRequired,
    themeColor: PropTypes.string.isRequired,
    generalSetting: PropTypes.array.isRequired,
    toggleNotification: PropTypes.bool.isRequired,
    toggleEqualizer: PropTypes.bool.isRequired,
};

const mapStateToProps = ({navigationReducer}) => {
    const {
        addClassactive,
        addClassactiveChild,
        addClassactiveChildApp,
        addClassactiveChildFM,
        addClassactiveChildBlog,
        addClassactiveChildUI,
        addClassactiveChildWidgets,
        addClassactiveChildAuth,
        addClassactiveChildPages,
        addClassactiveChildForms,
        addClassactiveChildTables,
        addClassactiveChildChart,
        addClassactiveChildMaps,
        themeColor,
        generalSetting,
        toggleNotification,
        toggleEqualizer,
        menuProfileDropdown,
        sideMenuTab,
        isToastMessage,
    } = navigationReducer;
    return {
        addClassactive,
        addClassactiveChild,
        addClassactiveChildApp,
        addClassactiveChildFM,
        addClassactiveChildBlog,
        addClassactiveChildUI,
        addClassactiveChildWidgets,
        addClassactiveChildAuth,
        addClassactiveChildPages,
        addClassactiveChildForms,
        addClassactiveChildTables,
        addClassactiveChildChart,
        addClassactiveChildMaps,
        themeColor,
        generalSetting,
        toggleNotification,
        toggleEqualizer,
        menuProfileDropdown,
        sideMenuTab,
        isToastMessage,
    };
};

export default connect(mapStateToProps, {
    onPressDashbord,
    onPressDashbordChild,
    onPressThemeColor,
    onPressGeneralSetting,
    onPressNotification,
    onPressEqualizer,
    onPressSideMenuToggle,
    onPressMenuProfileDropdown,
    onPressSideMenuTab,
    tostMessageLoad,
})(NavbarMenu);
