import React,{Component} from "react";
import PageHeader from "../../components/PageHeader";
import {
    getVendorDetails,
    registerVendor,
    updateUser,
    updateVendorData,
    userDetails
} from "../../services/userServices/userService";
import {Link} from "react-router-dom";
import {Toast} from "react-bootstrap";
import Swal from "sweetalert2";
import {getSubInterest, interestLists} from "../../services/InterestServices/interestService";

class EditVendor extends Component{
    constructor(props) {
        super(props);

        this.state = {
            vendorId: this.props?.match?.params?.vendorId,
            isLoad: false,
            userDetail: {
                firstName: "",
                lastName: "",
                companyName: "",
                email: "",
                countryCode: "",
                mobileNumber: "",
                country: "",
                state: "",
                city: "",
                address: "",
                postalCode: "",
                interestId: "",
                subInterests: "",
                status: "",
                websiteLink: "",
                instagramLink: "",
            },
            errors:{
                password: false,
                confirmPassword: false,
            },
            isToastMessage: false,
            successMessage: "",
            interestLists: [],
            subInterestLists: [],
            companyLogo: "",
        }
    }

    async componentDidMount() {
        await this.loadInterest();
        await this.getVendorDetails();
    }

    getVendorDetails = async () => {
        const get = await getVendorDetails(this.state.vendorId);
        if(get.status === "success"){
            let interestId = get.data.interests[0] !== undefined ? get.data.interests[0] : "";
            await this.subInterestById(interestId);
            this.setState({
                userDetail: {
                    firstName: get.data.first_name,
                    lastName: get.data.last_name,
                    companyName: get.data.companyName,
                    email: get.data.email,
                    countryCode: get.data.country_code,
                    mobileNumber: get.data.mobile_number,
                    country: get.data.country,
                    state: get.data.state,
                    city: get.data.city,
                    address: get.data.address,
                    postalCode: get.data.postalCode,
                    interestId: get.data.interests[0] ?? "",
                    subInterests: get.data.subInterests,
                    status: get.data.status,
                    websiteLink: get.data.websiteLink,
                    instagramLink: get.data.instagramLink,
                }
            });
        }
    }

    loadInterest = async () => {
        const getInterest = await interestLists(1,10,"all");
        if(getInterest.results !== undefined){
            this.setState({
                interestLists: getInterest.results,
            });
        }
    }

    onChangeFiled = async (field,value) => {
        let userDetails = this.state.userDetail;
        userDetails[field] = value;

        if(field === "interestId"){
            await this.subInterestById(value);
        }

        this.setState(userDetails);
    }

    subInterestById = async (interestId) => {
        const get = await getSubInterest(interestId);
        if(get.status === "success"){
            this.setState({
                subInterestLists: get.data,
            });
        }
    }

    tostMessageLoad = () => {
        this.setState({
            isToastMessage: !this.state.isToastMessage
        })
    }

    validation = () => {
        let success = true;
        let errors = this.state.errors;
        errors['confirmPassword'] = false;

        if(this.state.userDetail.password !== "" && this.state.userDetail.confirmPassword !== ""){
            if(this.state.userDetail.password.length < 8){
                errors['password'] = true;
                success = false;
            }else{
                if(this.state.userDetail.password !== this.state.userDetail.confirmPassword){
                    errors['confirmPassword'] = true;
                    success = false;
                }
            }
        }

        this.setState({errors});

        return success;
    }

    submitUpdateVendor = async () => {
        const newFormData = new FormData();
        // this.state.userDetail
        newFormData.append("vendorId", this.state.vendorId);
        newFormData.append("firstName", this.state.userDetail.firstName);
        newFormData.append("lastName", this.state.userDetail.lastName);
        newFormData.append("companyName", this.state.userDetail.companyName);
        newFormData.append("email", this.state.userDetail.email);
        newFormData.append("countryCode", this.state.userDetail.countryCode);
        newFormData.append("mobileNumber", this.state.userDetail.mobileNumber);
        newFormData.append("country", this.state.userDetail.country);
        newFormData.append("state", this.state.userDetail.state);
        newFormData.append("city", this.state.userDetail.city);
        newFormData.append("address", this.state.userDetail.address);
        newFormData.append("postalCode", this.state.userDetail.postalCode);
        newFormData.append("password", this.state.userDetail.password);
        newFormData.append("confirmPassword", this.state.userDetail.confirmPassword);
        newFormData.append("interestId", this.state.userDetail.interestId);
        newFormData.append("subInterestId", this.state.userDetail.subInterestId);
        newFormData.append("status", this.state.userDetail.status);
        newFormData.append("websiteLink", this.state.userDetail.websiteLink);
        newFormData.append("instagramLink", this.state.userDetail.instagramLink);
        if(this.state.companyLogo !== ""){
            newFormData.append("companyLogo", this.state.companyLogo);
        }
        const update = await updateVendorData(newFormData);
        if(update.status === "success"){
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Vendor updated successfully."
            }).then((res) => {
                if(res.isConfirmed){
                    this.props.history.push('/registered-users');
                }
            });
        }else{
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: update.message
            });
        }
    }

    onChangeFile = (e) => {
        if (e.target.files.length > 0) {
            this.setState({
                companyLogo: e.target.files[0]
            })
        }
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
                        HeaderText="Edit Vendor"
                        Breadcrumb={[
                            { name: "Vendor Users", navigate: "/vendor-users" },
                            { name: "Edit Vendor", navigate: "" },
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
                                            value={this.state.userDetail?.firstName || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("firstName", e.target.value)
                                            } }
                                            maxLength={15}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            className={`form-control`}
                                            value={this.state.userDetail?.lastName || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("lastName", e.target.value)
                                            } }
                                            maxLength={15}
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
                                            maxLength={100}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Company Name</label>
                                        <input
                                            className={`form-control`}
                                            value={this.state.userDetail?.companyName || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("companyName", e.target.value)
                                            } }
                                            maxLength={25}
                                        />
                                    </div>
                                </div>

                                <div className='col-md-1'>
                                    <div className="form-group">
                                        <label>Country Code</label>
                                        <input
                                            className="form-control"
                                            value={this.state.userDetail?.countryCode || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("countryCode", e.target.value)
                                            } }
                                            maxLength={3}
                                        />
                                    </div>
                                </div>

                                <div className='col-md-2'>
                                    <div className="form-group">
                                        <label>Mobile Number</label>
                                        <input
                                            className="form-control"
                                            value={this.state.userDetail?.mobileNumber || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("mobileNumber", e.target.value)
                                            } }
                                            maxLength={12}
                                        />
                                    </div>
                                </div>

                                <div className='col-md-2'>
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input
                                            className="form-control"
                                            value={this.state.userDetail?.country || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("country", e.target.value)
                                            } }
                                            maxLength={30}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-2'>
                                    <div className="form-group">
                                        <label>State</label>
                                        <input
                                            className="form-control"
                                            value={this.state.userDetail?.state || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("state", e.target.value)
                                            } }
                                            maxLength={30}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-2'>
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            className="form-control"
                                            value={this.state.userDetail?.city || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("city", e.target.value)
                                            } }
                                            maxLength={30}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input
                                            className="form-control"
                                            value={this.state.userDetail?.address || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("address", e.target.value)
                                            } }
                                            maxLength={60}
                                        />
                                    </div>
                                </div>

                                <div className='col-md-2'>
                                    <div className="form-group">
                                        <label>Postal Code</label>
                                        <input
                                            className="form-control"
                                            value={this.state.userDetail?.postalCode || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("postalCode", e.target.value)
                                            } }
                                            maxLength={10}
                                        />
                                    </div>
                                </div>

                                <div className='col-md-2'>
                                    <div className="form-group">
                                        <label>Website Link</label>
                                        <input
                                            className="form-control"
                                            value={this.state.userDetail?.websiteLink || ''}
                                            name="websiteLink"
                                            type="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("websiteLink", e.target.value)
                                            } }
                                        />
                                    </div>
                                </div>
                                <div className='col-md-2'>
                                    <div className="form-group">
                                        <label>Instagram Link</label>
                                        <input
                                            className="form-control"
                                            value={this.state.userDetail?.instagramLink || ''}
                                            name="instagramLink"
                                            type="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("instagramLink", e.target.value)
                                            } }
                                        />
                                    </div>
                                </div>

                                <div className='col-md-2'>
                                    <div className="form-group">
                                        <label>Interest</label>
                                        <select className='form-control' onChange={ (e) => {
                                            this.onChangeFiled("interestId", e.target.value)
                                        } } value={this.state.userDetail?.interestId || ''}>
                                            <option value="" disabled>Select Interest</option>
                                            {
                                                this.state.interestLists.map((interest) =>
                                                    <option value={interest.id} >{interest.name}</option>
                                                )
                                            }

                                        </select>
                                    </div>
                                </div>

                                <div className='col-md-3'>
                                    <div className="form-group">
                                        <label>Sub Interest</label>
                                        <select className='form-control' onChange={ (e) => {
                                            this.onChangeFiled("subInterests", e.target.value)
                                        } } value={this.state.userDetail?.subInterests || ''}>
                                            <option value="" disabled>Select Sub Interest</option>
                                            {
                                                this.state.subInterestLists.map((interest) =>
                                                    <option value={interest.id} >{interest.name}</option>
                                                )
                                            }

                                        </select>
                                    </div>
                                </div>

                                <div className='col-md-2'>
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
                            <div className='col-md-2'>
                                <div className="form-group">
                                    <label>Company Logo</label>
                                    <input type={"file"} onChange={ (e) => { this.onChangeFile(e) } } />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <button className="btn btn-info" onClick={() => { this.submitUpdateVendor(); } }>Save</button>
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

export default EditVendor;