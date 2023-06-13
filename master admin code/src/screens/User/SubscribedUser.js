import React from "react";
import swal from "sweetalert2";
import {Link} from "react-router-dom";
import {deleteUser, userList} from "../../services/userServices/userService";
import ReactPaginate from "react-paginate";
import Cookies from "universal-cookie";
import moment from "moment";
import PageHeader from "../../components/PageHeader";
import UserTable from "../Tables/UserTable";
import SubscribedUserTable from "../Tables/SubscribedUserTable";

class SubscribedUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoad: true,
            userList: [],
        }
    }

    async componentDidMount() {
        await this.loadUser();
    }

    loadUser = async (page) => {
        this.setState({isLoad: true});
        const getUserList = await userList(page);
        if (getUserList.status !== "error") {
            this.setState({
                userList: getUserList
            });
            this.setState({isLoad: false});
        }
        this.setState({isLoad: false});
    }

    render() {
        return (
            <div>
                <div className="page-loader-wrapper" style={{display: this.state.isLoad ? 'block' : 'none'}}>
                    <div className="loader">
                        <div className="m-t-30"><img src={require('../../assets/images/logo-icon.svg')} width="48"
                                                     height="48" alt="Lucid"/></div>
                        <p>Please wait...</p>
                    </div>
                </div>
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="Subscribed Users"
                        Breadcrumb={[
                            { name: "Subscribed Users", navigate: "/subscribed-users" },
                        ]}
                    />
                    <div className="row clearfix">
                        {
                            !this.state.isLoad && (<SubscribedUserTable userList={this.state.userList} loadUser={(e) => { this.loadUser(e) }} />)
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default SubscribedUser;
