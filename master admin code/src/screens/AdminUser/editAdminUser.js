import React,{Component} from "react";
import PageHeader from "../../components/PageHeader";
import {Link} from "react-router-dom";
import {userDetails} from "../../services/userServices/userService";
import {editAdminUser} from "../../services/adminUserServices/adminUserService";
import swal from "sweetalert2";
import {permissionJson} from "./permission";

class EditAdminUser extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isLoad: false,
            userId: this.props?.match?.params?.userId,
            userDetails: {
                userId:'',
                name: '',
                username: '',
                email: '',
                password: '',
                confirm_password: '',
                country_code: '',
                mobile_number: '',
                gender: '',
                permissions: permissionJson
            },
            errors:{
                first_name: false,
                last_name: false,
                username: false,
                email: false,
                password: false,
                confirm_password: false,
                password_not_match: false,
                country_code: false,
                mobile_number: false,
                gender: false,
            }
        }
    }

    async componentDidMount() {
        const getDetails = await userDetails(this.state.userId);
        if(getDetails.status === 'success'){
            this.setState({
                userDetails: getDetails?.data
            });
        }
        this.setState({ isLoad: false });
    }

    onChangeFiled = (field, value) => {
        let userDetails = this.state.userDetails;
        userDetails[field] = value;
        this.setState(userDetails);
    }

    changePermission = (type,permission,value) => {
        let userPermission = this.state.userDetails;
        let tempPermission = userPermission.permissions;

        if(type === 'dashboard'){
            tempPermission[0][type][permission] = value;
        }else if (type === 'registeredUser'){
            tempPermission[1][type][permission] = value;
        }else if (type === 'interest') {
            tempPermission[2][type][permission] = value;
        }else if (type === 'adminUser') {
            tempPermission[3][type][permission] = value;
        }else if (type === 'subscription') {
            tempPermission[4][type][permission] = value;
        }else if (type === 'orders') {
            tempPermission[5][type][permission] = value;
        }else if (type === 'payment') {
            tempPermission[6][type][permission] = value;
        }else if (type === 'gift') {
            tempPermission[7][type][permission] = value;
        }else if (type === 'rating') {
            tempPermission[8][type][permission] = value;
        }
        userPermission['permissions'] = tempPermission;

        this.setState({
            userDetails: userPermission
        });
    }

    validation = () => {
        let success = true;
        let errors = this.state.errors;
        errors['first_name'] = false;
        errors['last_name'] = false;
        errors['username'] = false;
        errors['email'] = false;
        errors['country_code'] = false;
        errors['mobile_number'] = false;
        errors['gender'] = false;

        if(!this.state.userDetails.first_name){
            errors['first_name'] = true;
            success = false;
        }
        if(!this.state.userDetails.last_name){
            errors['last_name'] = true;
            success = false;
        }
        if(!this.state.userDetails.username){
            errors['username'] = true;
            success = false;
        }
        if(!this.state.userDetails.email){
            errors['email'] = true;
            success = false;
        }

        if(!this.state.userDetails.country_code){
            errors['country_code'] = true;
            success = false;
        }

        if(!this.state.userDetails.mobile_number){
            errors['mobile_number'] = true;
            success = false;
        }
        if(!this.state.userDetails.gender){
            errors['gender'] = true;
            success = false;
        }

        this.setState(errors);

        return success;
    }

    updateUser = async () => {
        delete this.state.userDetails?.createdAt;
        delete this.state.userDetails?.updatedAt;
        const data = {
            userId: this.state.userId,
            ...this.state.userDetails
        }
        if(this.validation()){
            this.setState({ isLoad: true });
            const update = await editAdminUser(data);
            if(update.status === 'success'){
                await swal.fire({
                    icon: 'success',
                    title:'Success!',
                    text: update.message
                }).then((result) => {
                    if(result.isConfirmed){
                        this.props.history.push('/admin-users');
                    }
                })
                this.setState({ isLoad: false });
            }else{
                this.setState({ isLoad: false });
                await swal.fire({
                    icon: 'error',
                    title:'Error!',
                    text: update.message
                });
            }
        }
    }

    render(){
        return (
            <div>
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="Edit Admin User"
                        Breadcrumb={[
                            { name: "Admin Users", navigate: "/admin-users" },
                        ]}
                    />


                    <div className="card">
                        <div className="header">

                        </div>
                        <div className="body">
                            <div className="row">
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            className={`form-control`}
                                            value={this.state.userDetails?.first_name || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("first_name", e.target.value)
                                            } }
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            className={`form-control`}
                                            value={this.state.userDetails?.last_name || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("last_name", e.target.value)
                                            } }
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="text"
                                            className={`form-control`}
                                            value={this.state.userDetails?.email || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("email", e.target.value)
                                            } }
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            className={`form-control`}
                                            value={this.state.userDetails?.username || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("username", e.target.value)
                                            } }
                                        />
                                    </div>
                                </div>
                                <div className='col-md-1'>
                                    <div className="form-group">
                                        <label>Country Code</label>
                                        <input
                                            type="text"
                                            className={`form-control`}
                                            value={this.state.userDetails?.country_code || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("country_code", e.target.value)
                                            } }
                                        />
                                    </div>
                                </div>
                                <div className='col-md-3'>
                                    <div className="form-group">
                                        <label>Mobile Number</label>
                                        <input
                                            type="number"
                                            className={
                                                this.state.errors.mobile_number ? `form-control parsley-error` : `form-control`
                                            }
                                            value={this.state.userDetails?.mobile_number || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("mobile_number", e.target.value)
                                            } }
                                            maxLength={12}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-2'>
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select className={
                                            this.state.errors.gender ? `form-control parsley-error` : `form-control`
                                        } onChange={(e) => {
                                            this.onChangeFiled("gender", e.target.value)
                                        }} value={this.state.userDetails.gender}>
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="FeMale">FeMale</option>
                                        </select>
                                    </div>
                                </div>

                            </div>

                            <p><b>Permissions:</b></p>

                            <div className="row ml-3">
                                <div className="col-md-4">
                                    <p className="mb-1"><b>Dashboard</b></p>
                                    <input type="checkbox" 
                                           onChange={ (e) => {
                                               this.changePermission('dashboard','view',e.target.checked)
                                           } }
                                           checked={this.state.userDetails?.permissions[0]?.dashboard?.view} /> View
                                </div>

                                <div className="col-md-4">
                                    <p className="mb-1"><b>Registered User</b></p>
                                    <input type="checkbox" onChange={ (e) => {
                                        this.changePermission('registeredUser','view',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[1]?.registeredUser?.view} /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('registeredUser','edit',e.target.checked)
                                    } }  checked={this.state.userDetails?.permissions[1]?.registeredUser?.edit} /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('registeredUser','delete',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[1]?.registeredUser?.delete} /> Delete
                                </div>

                                <div className="col-md-4">
                                    <p className="mb-1"><b>Interest</b></p>
                                    <input type="checkbox" onChange={ (e) => {
                                        this.changePermission('interest','view',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[2]?.interest?.view} /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('interest','add',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[2]?.interest?.add}/> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('interest','edit',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[2]?.interest?.edit}/> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('interest','delete',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[2]?.interest?.delete} /> Delete
                                </div>


                                <div className="col-md-4 mt-3">
                                    <p className="mb-1"><b>Admin Users</b></p>
                                    <input type="checkbox" onChange={ (e) => {
                                        this.changePermission('adminUser','view',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[3]?.adminUser?.view} /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('adminUser','add',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[3]?.adminUser?.add} /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('adminUser','edit',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[3]?.adminUser?.edit} /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('adminUser','delete',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[3]?.adminUser?.delete} /> Delete
                                </div>

                                <div className="col-md-4 mt-3">
                                    <p className="mb-1"><b>Subscription</b></p>
                                    <input type="checkbox" onChange={ (e) => {
                                        this.changePermission('subscription','view',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[4]?.subscription?.view} /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('subscription','add',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[4]?.subscription?.add} /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('subscription','edit',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[4]?.subscription?.edit} /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('subscription','delete',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[4]?.subscription?.delete}/> Delete
                                </div>

                                <div className="col-md-4 mt-3">
                                    <p className="mb-1"><b>Orders</b></p>
                                    <input type="checkbox" onChange={ (e) => {
                                        this.changePermission('orders','view',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[5]?.orders?.view} /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('orders','add',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[5]?.orders?.add} /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('orders','edit',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[5]?.orders?.edit} /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('orders','delete',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[5]?.orders?.delete}/> Delete
                                </div>

                                <div className="col-md-4 mt-3">
                                    <p className="mb-1"><b>Payments</b></p>
                                    <input type="checkbox" onChange={ (e) => {
                                        this.changePermission('payment','view',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[6]?.payment?.view} /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('payment','add',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[6]?.payment?.add} /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('payment','edit',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[6]?.payment?.edit} /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('payment','delete',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[6]?.payment?.delete}/> Delete
                                </div>

                                <div className="col-md-4 mt-3">
                                    <p className="mb-1"><b>Gift</b></p>
                                    <input type="checkbox" onChange={ (e) => {
                                        this.changePermission('gift','view',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[7]?.gift?.view} /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('gift','add',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[7]?.gift?.add} /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('gift','edit',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[7]?.gift?.edit} /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('gift','delete',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[7]?.gift?.delete}/> Delete
                                </div>

                                <div className="col-md-4 mt-3">
                                    <p className="mb-1"><b>Rating</b></p>
                                    <input type="checkbox" onChange={ (e) => {
                                        this.changePermission('rating','view',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[8]?.rating?.view} /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('rating','add',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[8]?.rating?.add} /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('rating','edit',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[8]?.rating?.edit} /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('rating','delete',e.target.checked)
                                    } } checked={this.state.userDetails?.permissions[8]?.rating?.delete}/> Delete
                                </div>

                            </div>

                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <button className="btn btn-info" onClick={() => { this.updateUser(); } } disabled={this.state.isLoad} >
                                        {
                                            this.state.isLoad ? 'Loading...' : 'Update'
                                        }
                                    </button>
                                    <Link to="/admin-users">
                                        <button className="btn btn-default ml-3">Cancel</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default EditAdminUser;