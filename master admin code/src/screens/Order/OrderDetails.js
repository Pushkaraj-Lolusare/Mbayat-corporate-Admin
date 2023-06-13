import React, {Component} from 'react';
import {orderDetailById} from "../../services/orderServices/orderService";
import PageHeader from "../../components/PageHeader";

class OrderDetails extends Component{
    constructor(props) {
        super(props);

        this.state = {
            orderId: props.match.params.orderId ?? "",
            orderDetails: {},
        }
    }

    async componentDidMount() {
        await this.getOrderDetails();
    }

    getOrderDetails = async () => {
        const get = await orderDetailById(this.state.orderId);
        if(get.status === "success"){
            this.setState({
                orderDetails: get.data,
            })
        }
    }

    render() {
        return (
            <>
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="Order Details"
                        Breadcrumb={[
                            { name: "Orders", navigate: "/order-list" },
                        ]}
                    />
                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="header pb-0">
                                    <h2>
                                        Order Details
                                    </h2>
                                </div>

                                <div className="container-fluid">
                                    <div className='row pt-5 pb-5'>
                                        <div className="col-md-3">
                                            <label>OrderID</label>
                                            <p>{ this.state.orderDetails.id }</p>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Customer Name</label>
                                            <p>{ this.state.orderDetails.userId?.first_name + ' ' + this.state.orderDetails.userId?.last_name }</p>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Vendor Name</label>
                                            <p>{ this.state.orderDetails.vendorId?.first_name + ' ' + this.state.orderDetails.vendorId?.last_name }</p>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Product Name</label>
                                            <p>{ this.state.orderDetails.productId?.name}</p>
                                        </div>
                                        <div className="col-md-3 mt-4">
                                            <label>Product Image</label>
                                            <p>
                                                {
                                                    this.state.orderDetails.productId?.productImages[0] !== undefined && (
                                                        <img src={this.state.orderDetails.productId?.productImages[0]} height={150} style={{ marginLeft: '10px', borderRadius: '5px' }} />
                                                    )
                                                }
                                            </p>

                                        </div>
                                        <div className="col-md-3 mt-4">
                                            <label>Product Price</label>
                                            <p>{ this.state.orderDetails.productPrice}</p>
                                        </div>
                                        <div className="col-md-3 mt-4">
                                            <label>Total Quantity</label>
                                            <p>{ this.state.orderDetails.totalQuantity}</p>
                                        </div>
                                        <div className="col-md-3 mt-4">
                                            <label>Order Type</label>
                                            <p>{ this.state.orderDetails.orderType}</p>
                                        </div>
                                        <div className="col-md-3 mt-4">
                                            <label>Order Status</label>
                                            <p className="text-capitalize">{ this.state.orderDetails.orderStatus}</p>
                                        </div>
                                        <div className="col-md-3 mt-4">
                                            <label>Total Tax</label>
                                            <p>{ this.state.orderDetails.tax}</p>
                                        </div>
                                        <div className="col-md-3 mt-4">
                                            <label>Shipping Charge</label>
                                            <p>{ this.state.orderDetails.shippingCharge}</p>
                                        </div>
                                        <div className="col-md-3 mt-4">
                                            <label>Order Total</label>
                                            <p>{ this.state.orderDetails.subTotal}</p>
                                        </div>
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

export default OrderDetails;