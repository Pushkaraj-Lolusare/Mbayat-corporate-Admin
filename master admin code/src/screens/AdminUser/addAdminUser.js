import React,{Component} from "react";
import PageHeader from "../../components/PageHeader";
import {Link} from "react-router-dom";
import {addAdminUser} from "../../services/adminUserServices/adminUserService";
import swal from "sweetalert2";
import {permissionJson} from "./permission";

class AddAdminUser extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isLoad: false,
            userDetails:{
                first_name: '',
                last_name: '',
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

    onChangeFiled = (field, value) => {
        let userDetails = this.state.userDetails;
        userDetails[field] = value;
        this.setState(userDetails);
    }

    changePermission = (type,permission,value) => {
        let userPermission = this.state.userDetails;
        let tempPermission = userPermission.permissions;
        let permissionValue = false;

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
        errors['password'] = false;
        errors['confirm_password'] = false;
        errors['password_not_match'] = false;
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
        if(!this.state.userDetails.password){
            errors['password'] = true;
            success = false;
        }
        if(!this.state.userDetails.confirm_password){
            errors['confirm_password'] = true;
            success = false;
        }
        if(this.state.userDetails.password !== "" && this.state.userDetails.confirm_password){
            if(this.state.userDetails.password !== this.state.userDetails.confirm_password){
                errors['password_not_match'] = true;
                success = false;
            }
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

    saveAdminUser = async () => {
        if(this.validation()){
            this.setState({ isLoad: true });
            const saveUser = await addAdminUser(this.state.userDetails);
            if(saveUser.status === 'success'){
                await swal.fire({
                    icon: 'success',
                    title:'Success!',
                    text: saveUser.message
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
                    text: saveUser.message
                });

            }
        }
    }

    render(){
        return (
            <div>
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="Add Admin User"
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
                                            className={
                                                this.state.errors.first_name ? `form-control parsley-error` : `form-control`
                                            }
                                            value={this.state.userDetails?.first_name || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("first_name", e.target.value)
                                            } }
                                            maxLength={25}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            className={
                                                this.state.errors.last_name ? `form-control parsley-error` : `form-control`
                                            }
                                            value={this.state.userDetails?.last_name || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("last_name", e.target.value)
                                            } }
                                            maxLength={25}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="text"
                                            className={
                                                this.state.errors.email ? `form-control parsley-error` : `form-control`
                                            }
                                            value={this.state.userDetails?.email || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("email", e.target.value)
                                            } }
                                            maxLength={99}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            className={
                                                this.state.errors.username ? `form-control parsley-error` : `form-control`
                                            }
                                            value={this.state.userDetails?.username || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("username", e.target.value)
                                            } }
                                            maxLength={12}
                                        />
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            className={
                                                this.state.errors.password ? `form-control parsley-error` : `form-control`
                                            }
                                            value={this.state.userDetails?.password || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("password", e.target.value)
                                            } }
                                            maxLength={25}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <input
                                            type="password"
                                            className={
                                                this.state.errors.confirm_password ? `form-control parsley-error` : `form-control`
                                            }
                                            value={this.state.userDetails?.confirm_password || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("confirm_password", e.target.value)
                                            } }
                                            maxLength={25}
                                        />
                                    </div>
                                    <p className="text-danger">
                                        {
                                            this.state.errors.password_not_match ? 'Password and confirm password are not same.' : ''
                                        }
                                    </p>
                                </div>

                                <div className='col-md-1'>
                                    <div className="form-group">
                                        <label>Country Code</label>
                                        <input
                                            type="text"
                                            className={
                                                this.state.errors.country_code ? `form-control parsley-error` : `form-control`
                                            }
                                            value={this.state.userDetails?.country_code || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("country_code", e.target.value)
                                            } }
                                            maxLength={4}
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
                                        }}>
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
                                    <input
                                        type="checkbox"
                                           className=""
                                           onChange={ (e) => {
                                               this.changePermission('dashboard','view',e.target.checked)
                                           } } /> View
                                </div>

                                <div className="col-md-4">
                                    <p className="mb-1"><b>Registered User</b></p>
                                    <input type="checkbox" className=""
                                           onChange={ (e) => {
                                        this.changePermission('registeredUser','view',e.target.checked)
                                    } } /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('registeredUser','edit',e.target.checked)
                                    } } /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('registeredUser','delete',e.target.checked)
                                    } } /> Delete
                                </div>

                                <div className="col-md-4">
                                    <p className="mb-1"><b>Interest</b></p>
                                    <input type="checkbox" className="" onChange={ (e) => {
                                        this.changePermission('interest','view',e.target.checked)
                                    } } /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('interest','add',e.target.checked)
                                    } } /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('interest','edit',e.target.checked)
                                    } } /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('interest','delete',e.target.checked)
                                    } } /> Delete
                                </div>


                                <div className="col-md-4 mt-3">
                                    <p className="mb-1"><b>Admin Users</b></p>
                                    <input type="checkbox" className="" onChange={ (e) => {
                                        this.changePermission('adminUser','view',e.target.checked)
                                    } } /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('adminUser','add',e.target.checked)
                                    } } /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('adminUser','edit',e.target.checked)
                                    } } /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('adminUser','delete',e.target.checked)
                                    } } /> Delete
                                </div>

                                <div className="col-md-4 mt-3">
                                    <p className="mb-1"><b>Subscription</b></p>
                                    <input type="checkbox" className="" onChange={ (e) => {
                                        this.changePermission('subscription','view',e.target.checked)
                                    } } /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('subscription','add',e.target.checked)
                                    } } /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('subscription','edit',e.target.checked)
                                    } } /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('subscription','delete',e.target.checked)
                                    } } /> Delete
                                </div>

                                <div className="col-md-4 mt-3">
                                    <p className="mb-1"><b>Orders</b></p>
                                    <input type="checkbox" className="" onChange={ (e) => {
                                        this.changePermission('orders','view',e.target.checked)
                                    } } /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('orders','add',e.target.checked)
                                    } } /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('orders','edit',e.target.checked)
                                    } } /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('orders','delete',e.target.checked)
                                    } } /> Delete
                                </div>

                                <div className="col-md-4 mt-3">
                                    <p className="mb-1"><b>Payments</b></p>
                                    <input type="checkbox" className="" onChange={ (e) => {
                                        this.changePermission('payment','view',e.target.checked)
                                    } } /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('payment','add',e.target.checked)
                                    } } /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('payment','edit',e.target.checked)
                                    } } /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('payment','delete',e.target.checked)
                                    } } /> Delete
                                </div>

                                <div className="col-md-4 mt-3">
                                    <p className="mb-1"><b>Gift</b></p>
                                    <input type="checkbox" className="" onChange={ (e) => {
                                        this.changePermission('gift','view',e.target.checked)
                                    } } /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('gift','add',e.target.checked)
                                    } } /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('gift','edit',e.target.checked)
                                    } } /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('gift','delete',e.target.checked)
                                    } } /> Delete
                                </div>

                                <div className="col-md-4 mt-3">
                                    <p className="mb-1"><b>Rating</b></p>
                                    <input type="checkbox" className="" onChange={ (e) => {
                                        this.changePermission('rating','view',e.target.checked)
                                    } } /> View
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('rating','add',e.target.checked)
                                    } } /> Add
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('rating','edit',e.target.checked)
                                    } } /> Edit
                                    <input type="checkbox" className="ml-4" onChange={ (e) => {
                                        this.changePermission('rating','delete',e.target.checked)
                                    } } /> Delete
                                </div>

                            </div>

                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <button className="btn btn-info"
                                            onClick={() => { this.saveAdminUser(); } }
                                    disabled={this.state.isLoad}>
                                        {
                                            this.state.isLoad ? 'Loading...' : 'Save'
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

export default AddAdminUser;