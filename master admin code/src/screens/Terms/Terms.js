import React, {Component} from "react";
import PageHeader from "../../components/PageHeader";
import TermsTable from "../Tables/websiteContent/termsTable";

class Terms extends Component{

    constructor(props) {
        super(props);

        this.state = {}

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
                            HeaderText="Terms & Conditions"
                            Breadcrumb={[
                                { name: "Terms & Conditions", navigate: "/terms-and-condition" },
                            ]}
                        />
                        <div className="row clearfix">
                            {
                                !this.state.isLoad && (<TermsTable />)
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default Terms;