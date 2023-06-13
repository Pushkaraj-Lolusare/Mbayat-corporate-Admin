import React, {Component} from "react";
import {fetchAllPayments, paymentLists} from "../../../services/paymentServices/paymentService";
import moment from "moment";

class VendorPaymentTable extends Component{

    constructor(props) {
        super(props);

        this.state = {
            paymentLists: [],
        }

    }

    async componentDidMount() {
        await this.loadPayment();
    }

    loadPayment = async () => {
        const get = await fetchAllPayments();
        if(get.status === "success"){
            this.setState({
                paymentLists: get.data,
            });
        }else{
            this.setState({
                paymentLists: [],
            });
        }
    }

    render() {
        return (
            <>
                <div className="card">
                    <div className="header">
                        <h4>Vendor Payment</h4>
                    </div>
                    <div className="body table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th className="text-center">Vendor Name</th>
                                <th className="text-center">Payment</th>
                                <th className="text-center">Date</th>
                                <th className="text-center">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.paymentLists.map((item, index) =>
                                    <tr>
                                        <td>{index+1}</td>
                                        <td className="text-center">{ item?.vendorId?.first_name }</td>
                                        <td className="text-center">{item.price} KWD</td>
                                        <td className="text-center">{ moment(item.createdAt).format('MMM Y') }</td>
                                        <td className="text-center">
                                            {
                                                item.paymentStatus === "paid" ? <span className="badge badge-pill badge-success text-uppercase">{item.paymentStatus}</span>
                                                :
                                                    <span className="badge badge-pill badge-info text-uppercase">{item.paymentStatus}</span>
                                            }

                                        </td>
                                    </tr>)
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }

}

export default VendorPaymentTable;