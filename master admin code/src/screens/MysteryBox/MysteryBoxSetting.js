import React,{Component} from "react";
import PageHeader from "../../components/PageHeader";
import {registerVendor, updateUser, userDetails} from "../../services/userServices/userService";
import {Link} from "react-router-dom";
import {Toast} from "react-bootstrap";
import Swal from "sweetalert2";
import {interestLists} from "../../services/InterestServices/interestService";
import {getMysteryBoxSetting, updateMysteryBox} from "../../services/authServices/mysteryBoxService";
import Cookies from "universal-cookie";

class MysteryBoxSetting extends Component{
    constructor(props) {
        super(props);

        const cookies = new Cookies();

        this.state = {
            isLoad: false,
            mysteryBox: {
                id: "",
                userId: cookies.get('user').id,
                cutOffDate: "",
                autoRejectPeriod: "",
                numberOfInterest: "",
                availableSubscription: "",
            },
        }
    }

    async componentDidMount() {
        await this.fetchSetting();
    }

    fetchSetting = async () => {
        const get = await getMysteryBoxSetting();
        if(get.status === "success"){
            this.setState({
                mysteryBox: get.data,
            })
        }
    }

    onChangeFiled = (field,value) => {
        let getDetails = this.state.mysteryBox;
        getDetails[field] = value;
        this.setState(getDetails);
    }

    saveMysteryBox = async () => {

        const mysteryBox = await updateMysteryBox(this.state.mysteryBox);
        if (mysteryBox.status === "success") {
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: mysteryBox.message
            }).then((res) => {
                if (res.isConfirmed) {
                    window.location.reload();
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: mysteryBox.message
            });
        }
    }

    // addVendor = async () => {
    //     if(this.validation()){
    //         const register = await registerVendor(this.state.userDetail);
    //         if(register.status === "success"){
    //             Swal.fire({
    //                 icon: "success",
    //                 title: "Success!",
    //                 text: "Vendor created successfully."
    //             }).then((res) => {
    //                 if(res.isConfirmed){
    //                     this.props.history.push('/vendor-users');
    //                 }
    //             });
    //         }else{
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Error!",
    //                 text: register.message
    //             });
    //         }
    //     }
    // }

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
                        HeaderText="Mystery Box"
                        Breadcrumb={[
                            { name: "Mystery Box Setting", navigate: "/mysterybox-setting" },
                        ]}
                    />
                    <div className="card">
                        <div className="header">

                        </div>
                        <div className="body">
                            <div className="row">
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Cut OFF Date</label>
                                        <input
                                            type="date"
                                            className={`form-control`}
                                            value={this.state.mysteryBox?.cutOfDate || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("cutOfDate", e.target.value)
                                            } }
                                            maxLength={15}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Auto Reject Period</label>
                                        <input
                                            type="text"
                                            className={`form-control`}
                                            value={this.state.mysteryBox?.autoRejectPeriod || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("autoRejectPeriod", e.target.value)
                                            } }
                                            maxLength={15}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Number Of Interest Customer Can Choose</label>
                                        <input
                                            className={`form-control`}
                                            value={this.state.mysteryBox?.numberOfInterest || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("numberOfInterest", e.target.value)
                                            } }
                                            maxLength={100}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group">
                                        <label>Available number of subscription per month</label>
                                        <input
                                            className={`form-control`}
                                            value={this.state.mysteryBox?.subscriptionPerMonth || ''}
                                            name="text"
                                            required=""
                                            onChange={ (e) => {
                                                this.onChangeFiled("subscriptionPerMonth", e.target.value)
                                            } }
                                            maxLength={25}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <button className="btn btn-info" onClick={() => { this.saveMysteryBox(); } }>Save</button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        )
    }
}

export default MysteryBoxSetting;