import React, {Component} from "react";
import PageHeader from "../../components/PageHeader";
import UserTable from "../Tables/UserTable";
import {userList} from "../../services/userServices/userService";

class User extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isLoad: true,
            userList: [],
            interestId: "",
            userType: "",
            userGender: "",
            status:"acitve",
        };
    }

    async componentDidMount() {
        await this.loadUser();
    }

    loadUser = async (page,limit = 10,interestId = "", userType = "", userGender = "",status="active") => {
        this.setState({isLoad: true});
        const getUserList = await userList(page,limit,interestId,userType,userGender,status);
        if (getUserList.status !== "error") {
            this.setState({
                userList: getUserList,
                interestId: interestId,
                userType: userType,
                userGender: userGender,
                status,
            });
            this.setState({isLoad: false});
        }
        this.setState({isLoad: false});
    }

    render() {
        return (
            <div>
                <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
                    <div className="loader">
                        <div className="m-t-30"><img src={require('../../assets/images/logo-icon.svg')} width="48" height="48" alt="Lucid" /></div>
                        <p>Please wait...</p>
                    </div>
                </div>
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="Registered Users"
                        Breadcrumb={[
                            { name: "Users", navigate: "/registered-users" },
                        ]}
                    />
                    <div className="row clearfix">
                        {
                            !this.state.isLoad && (<UserTable
                                userList={this.state.userList}
                                interestId={this.state.interestId}
                                userType={this.state.userType}
                                userGender={this.state.userGender}
                                status={this.state.status}
                                loadUser={(page,limit,interestId,userType,userGender,status) => { this.loadUser(page,limit,interestId,userType,userGender,status) }}
                            />)
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default User;