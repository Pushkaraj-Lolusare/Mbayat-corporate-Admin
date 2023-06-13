import React, {Component} from 'react'
import PageHeader from "../../components/PageHeader";
import GiftTable from "../Tables/GiftTable";


class Gift extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isLoad: false,
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
                        HeaderText="Gift List"
                        Breadcrumb={[
                            { name: "Gift List", navigate: "/gift-list" },
                        ]}
                    />
                    <div className="row clearfix">
                        <GiftTable />
                    </div>
                </div>
            </>
        )
    }
}

export default Gift;