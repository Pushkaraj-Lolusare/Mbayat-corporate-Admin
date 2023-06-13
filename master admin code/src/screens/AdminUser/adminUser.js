import React,{Component} from "react";
import PageHeader from "../../components/PageHeader";
import AdminUserTable from "../Tables/AdminUserTable";
import {adminUserList} from "../../services/adminUserServices/adminUserService";
import Cookies from "universal-cookie";

class AdminUser extends Component{
    constructor(props) {
        super(props);

        const cookies = new Cookies();

        this.state = {
            isLoad: true,
            users:[],
            userDetails: cookies.get('user') ? cookies.get('user') : {},
            permission: cookies.get('user')?.permissions || [],
        }
    }

    async componentDidMount() {
        this.loadAdminUser();
    }

    loadAdminUser = async (e) => {
        this.setState({ isLoad: true });
        const fetchUser = await adminUserList(e);
        if(fetchUser.status === 'success'){

            this.setState({
                isLoad: false,
                users: fetchUser.data
            });
        }
        this.setState({ isLoad: false });
    }

    getModulePermission = (moduleName) => {
        let permission = {};
        let userPermission = this.state.permission;
        permission = userPermission.find((value) => value[moduleName]);
        return permission;
    }

    render() {
        return(
            <div>
                <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
                    <div className="loader">
                        <div className="m-t-30"><img src={require('../../assets/images/logo-icon.svg')} width="48" height="48" alt="Lucid" /></div>
                        <p>Please wait...</p>
                    </div>
                </div>
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="Admin Users"
                        Breadcrumb={[
                            { name: "Admin Users", navigate: "/admin-users" },
                        ]}
                    />
                    <div className="row clearfix">
                        {
                            !this.state.isLoad && (<AdminUserTable
                                users={ this.state.users }
                                loadUser={ (e) => { this.loadAdminUser(e); } }
                                load={this.state.isLoad}
                            />)
                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default AdminUser;