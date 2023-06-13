import React,{Component} from "react";
import PageHeader from "../../components/PageHeader";
import InterestTable from "../Tables/InterestTable";
import {interestLists} from "../../services/InterestServices/interestService";


class Interset extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isLoad: true,
            interestLists: [],
        }
    }

    async componentDidMount() {
        await this.loadInterest();
    }

    loadInterest = async (page) => { 
        const getLists = await interestLists(page);
        this.setState({isLoad: true});
        if(getLists.status !== "error"){
            this.setState({
                interestLists: getLists,
                isLoad: false,
            });
        }
        this.setState({isLoad: false});
    }

    render() {
        return(
            <div>
                <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
                    <div className="loader">
                        <div className="m-t-30"><img src={require('../../assets/images/logo-icon.svg')} width="48" height="48" alt="Lucid" /></div>
                        <p>Please wait...</p>
                    </div>
                </div>
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="Interest"
                        Breadcrumb={[
                            { name: "Interest", navigate: "interest" },
                        ]}
                    />
                    <div className="row clearfix">
                        { !this.state.isLoad && (<InterestTable interestLists={this.state.interestLists} loadInterest={(e) => { this.loadInterest(e) }} />) }
                    </div>
                </div>
            </div>
        )
    }
}

export default Interset;