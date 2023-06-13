import React, {Component} from "react";
import PageHeader from "../../components/PageHeader";
import AboutUsTable from "../Tables/websiteContent/AboutUsTable";
import PrivacyPolicyTable from "../Tables/websiteContent/privacyPolicy";

class Privacy extends Component{

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
                            HeaderText="Privacy Policy"
                            Breadcrumb={[
                                { name: "Privacy Policy", navigate: "/privacy-policy" },
                            ]}
                        />
                        <div className="row clearfix">
                            {
                                !this.state.isLoad && (<PrivacyPolicyTable />)
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default Privacy;