import React, {Component} from "react";
import PageHeader from "../../components/PageHeader";
import AboutUsTable from "../Tables/websiteContent/AboutUsTable";
import FaqsTable from "../Tables/websiteContent/faqsTable";

class Faq extends Component{

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
                            HeaderText="FAQ's"
                            Breadcrumb={[
                                { name: "FAQ's", navigate: "/faq" },
                            ]}
                        />
                        <div className="row clearfix">
                            {
                                !this.state.isLoad && (<FaqsTable />)
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default Faq;