import React, {Component} from "react";
import {getAllVendors, getMysteryBoxForAdmin} from "../../../services/userServices/userService";
import moment from "moment";
import {interestLists} from "../../../services/InterestServices/interestService";

class MysteryBoxTable extends Component{

    constructor(props) {
        super(props);

        this.state = {
            mysteryBoxLists: [],
            vendorLists: [],
            interestLists: [],
            selectedVendorId: "",
            selectedInterestId: "",
        }

    }

    async componentDidMount() {
        await this.getLists();
        await this.getVendorLists();
        await this.loadInterest();
    }

    loadInterest = async () => {
        const getInterest = await interestLists(1,10,"all");
        if(getInterest.results !== undefined){
            this.setState({
                interestLists: getInterest.results,
            });
        }
    }
    getLists = async (filter = null) => {
        const get = await getMysteryBoxForAdmin(filter);
        if(get.status === "success"){
            this.setState({
                mysteryBoxLists: get.data,
            });
        }
    }

    getVendorLists = async () => {
        const get = await getAllVendors(1,1000);
        if(get.status === "success"){
            this.setState({
                vendorLists: get.results,
            })
        }
    }

    onInterestChange = async (e) => {
        let interestId = e.target.value;
        this.setState({
            selectedInterestId: interestId,
        });
        await this.getLists({
            vendorId: this.state.selectedVendorId,
            interestId,
        });
    }

    onVendorChange = async (e) => {
        let vendorId = e.target.value;
        this.setState({
            selectedVendorId: vendorId,
        });

        await this.getLists({
            vendorId,
            interestId: this.state.selectedInterestId,
        });
    }

    render() {
        return (
            <>
                <div className="card">
                    <div className="header">
                        <h4>Mystery Box's</h4>
                        <div className="row">
                            <div className="col-md-8"></div>
                            <div className="col-md-2">
                                <select className="form-control"
                                        value={this.state.selectedInterestId}
                                        onChange={ (e) => { this.onInterestChange(e) } }
                                >
                                    <option value="">Select Interest</option>
                                    {
                                        this.state.interestLists.map((interest) =>
                                            <option value={interest.id} >{interest.name}</option>
                                        )
                                    }
                                </select>
                            </div>
                            <div className="col-md-2">
                                <select className="form-control" value={this.state.selectedVendorId} onChange={ (e) => { this.onVendorChange(e) } } >
                                    <option value="">Select Vendor</option>
                                    {
                                        this.state.vendorLists.map((vendor) =>
                                            <option value={vendor.id}>{vendor.first_name} {vendor.last_name}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="body table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th className="text-center">Vendor Name</th>
                                <th className="text-center">Customer Name</th>
                                <th className="text-center">Product Name</th>
                                <th className="text-center">Box Date</th>
                                <th className="text-center">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.mysteryBoxLists.map((item, index) =>
                                    <tr>
                                        <td>{index+1}</td>
                                        <td className="text-center">{ item.vendorId !== null && (item.vendorId?.first_name + ' ' + item.vendorId?.last_name) }</td>
                                        <td className="text-center">{ item.userId !== null && (item.userId?.first_name + ' ' + item.userId?.last_name) }</td>
                                        <td className="text-center">{ item.productId !== null && (item.productId?.name) }</td>
                                        <td className="text-center">{ moment(item.createdAt).format('MMM Y') }</td>
                                        <td className="text-center">
                                            <span className="badge badge-pill badge-success">{ item.status }</span>
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }

}

export default MysteryBoxTable;