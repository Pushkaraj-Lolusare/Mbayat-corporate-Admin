import React, {Component} from 'react'
import PageHeader from "../../components/PageHeader";
import {Link} from "react-router-dom";
import {createPlan} from "../../services/subscriptions/subscriptionService";
import Swal from "sweetalert2";

class CreateSubscription extends Component{

    constructor(props) {
        super(props);

        this.state = {
            planDetails:{
                planName: "",
                planPrice: "",
                planDuration: "",
                planType: "Monthly"
            }
        }
    }

    onChangeFiled = (field,value) => {
        let planDetails = this.state.planDetails;
        planDetails[field] = value;
        this.setState(planDetails);
    }

    savePlan = async () => {
        const create = await createPlan(this.state.planDetails);
        if(create.status === "success"){
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: create.message
            }).then((ok) => {
                if(ok.isConfirmed){
                    this.props.history.push('/subscription');
                }
            });
        }else{
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: create.message
            });
        }
    }

    render() {
        return (
            <>
                <div>
                    <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
                        <div className="loader">
                            <div className="m-t-30"><img src={require('../../assets/images/logo-icon.svg')} width="48" height="48" alt="Lucid" /></div>
                            <p>Please wait...</p>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <PageHeader
                            HeaderText="Subscription"
                            Breadcrumb={[
                                { name: "Subscription", navigate: "/subscription" },
                                { name: "Create Subscription", navigate: "" },
                            ]}
                        />
                    </div>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Plan Name: </label>
                                            <input type="text" className="form-control" placeholder="Plan Name"
                                                   value={this.state.planDetails.planName}
                                                   onChange={ (e) => { this.onChangeFiled('planName', e.target.value) } }
                                                   maxLength={25}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Plan Price: </label>
                                            <input type="text" className="form-control" placeholder="Plan Price"
                                                   value={this.state.planDetails.planPrice}
                                                   onChange={ (e) => { this.onChangeFiled('planPrice', e.target.value) } }
                                                   maxLength={4}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Plan Duration: </label>
                                            <select className="form-control"
                                                    value={this.state.planDetails.planDuration}
                                                    onChange={ (e) => { this.onChangeFiled('planDuration', e.target.value) } }
                                            >
                                                <option value="">Select Plan</option>
                                                <option value="1">1 Month</option>
                                                <option value="3">3 Months</option>
                                                <option value="6">6 Months</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <button className="btn btn-info" onClick={ () => { this.savePlan() } }>Save</button>
                                        <Link to="/subscription">
                                            <button className="btn btn-default ml-2">Cancel</button>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default CreateSubscription;