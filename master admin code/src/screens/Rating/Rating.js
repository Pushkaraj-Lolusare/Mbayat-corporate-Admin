import React,{Component} from "react";
import PageHeader from "../../components/PageHeader";
import RatingTable from "../Tables/RatingTable";

class Rating extends Component{

    constructor(props) {
        super(props);

        this.state = {

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
                        HeaderText="Rating"
                        Breadcrumb={[
                            { name: "Rating", navigate: "/rating" },
                        ]}
                    />
                    <div className="row clearfix">
                        <RatingTable />
                    </div>
                </div>
            </>
        )
    }
}

export default Rating;