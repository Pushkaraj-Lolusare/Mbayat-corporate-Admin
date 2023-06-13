import React, {Component} from 'react'
import PageHeader from "../../components/PageHeader";
import PaymentTable from "../Tables/PaymentTable";


class Payment extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isLoad: false
        }
    }

    render() {
        return (
            <>
                <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
                    <div className="loader">
                        <div className="m-t-30"><img src={require('../../assets/images/logo-icon.svg')} width="48" height="48" alt="Lucid" /></div>
                        <p>Please wait...</p>
                    </div>
                </div>
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="Vendor Payment List"
                        Breadcrumb={[
                            { name: "Payment List", navigate: "/payment-list" },
                        ]}
                    />
                    <div className="row clearfix">
                        <PaymentTable />
                    </div>
                </div>
            </>
        )
    }
}

export default Payment;