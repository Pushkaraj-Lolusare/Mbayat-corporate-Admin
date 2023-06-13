import React,{Component} from "react";
import PageHeader from "../../components/PageHeader";
import OrderTable from "../Tables/OrderTable";

class CorporateOrders extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isLoad: false
        }
    }

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
                        HeaderText="Corporate Orders Lists"
                        Breadcrumb={[
                            { name: "Orders", navigate: "/order-list" },
                        ]}
                    />
                    <div className="row clearfix">
                        <OrderTable orderType={'Corporate'} title={'Corporate Orders'} />
                    </div>
                </div>
            </div>
        )
    }
}

export default CorporateOrders;