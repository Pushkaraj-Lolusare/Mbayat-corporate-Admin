import React,{Component} from "react";
import PageHeader from "../../components/PageHeader";
import {updateUser, userDetails} from "../../services/userServices/userService";
import {Link} from "react-router-dom";
import {Toast} from "react-bootstrap";

class EditUser extends Component{
    constructor(props) {
        super(props);

        this.state = {
            userId: this.props?.match?.params?.userId,
            isLoad: true,
            userDetail: {},
            isToastMessage: false,
            successMessage: ""
        }
    }

    async componentDidMount() {
        const getDetails = await userDetails(this.state.userId);
        if(getDetails.status === 'success'){
            this.setState({
                userDetail: getDetails?.data
            });
        }
        this.setState({ isLoad: false });
    }

    onChangeFiled = (field,value) => {
        let userDetails = this.state.userDetail;
        userDetails[field] = value;
        this.setState(userDetails);
    }

    tostMessageLoad = () => {
        this.setState({
            isToastMessage: !this.state.isToastMessage
        })
    }

    updateUser = async () => {
        this.setState({ isLoad: true });
        const update = await updateUser(this.state.userDetail, this.state.userId);
        if(update.status === "success"){
            this.setState({
                isLoad: false,
                isToastMessage: true,
                successMessage: "User details updated successfully.",
            });
            setTimeout(() => {
                this.props.history.push('/registered-users');
            },1000);
        }
        this.setState({ isLoad: false });
    }

    render() {
        return (
            <div>
                <Toast
                    id="toast-container"
                    show={this.state.isToastMessage}
                    onClose={() => {
                        this.tostMessageLoad();
                    }}
                    className="toast-success toast-top-right"
                    autohide={true}
                    delay={5000}
                >
                    <Toast.Header className="toast-success mb-0">
                        {this.state.successMessage}
                    </Toast.Header>
                </Toast>
                <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
                    <div className="loader">
                        <div className="m-t-30"><img src={require('../../assets/images/logo-icon.svg')} width="48" height="48" alt="Lucid" /></div>
                        <p>Please wait...</p>
                    </div>
                </div>
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="Edit User"
                        Breadcrumb={[
                            { name: "Registered User", navigate: "/registered-users" },
                            { name: "Edit User", navigate: "" },
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
                                            value={this.state.userDetail?.first_name || ''}
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
                                            value={this.state.userDetail?.last_name || ''}
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
                                            className={`form-control`}
                                            value={this.state.userDetail?.email || ''}
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
                                        <label>Phone</label>
                                        <input
                                            className="form-control"
                                            value={this.state.userDetail?.mobile_number || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("mobile_number", e.target.value)
                                            } }
                                        />
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select className='form-control' onChange={ (e) => {
                                            this.onChangeFiled("gender", e.target.value)
                                        } } value={this.state.userDetail?.gender || ''}>
                                            <option value="" disabled>Select Gender</option>
                                            <option value="Male" >Male</option>
                                            <option value="FeMale">FeMale</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input
                                            className="form-control"
                                            value={this.state.userDetail?.date_of_birth || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("date_of_birth", e.target.value)
                                            } }
                                        />
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select className='form-control' onChange={ (e) => {
                                            this.onChangeFiled("status", e.target.value)
                                        } } value={this.state.userDetail?.status || ''}>
                                            <option value="" disabled>Select Status</option>
                                            <option value="active" >Active</option>
                                            <option value="in_active">In Active</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <button className="btn btn-info" onClick={() => { this.updateUser(); } }>Save</button>
                                    <Link to="/registered-users">
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

export default EditUser;