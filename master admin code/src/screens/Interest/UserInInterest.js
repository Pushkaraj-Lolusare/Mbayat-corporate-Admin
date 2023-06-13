import React, {Component} from "react"
import PageHeader from "../../components/PageHeader";
import {getUserByInterest} from "../../services/InterestServices/interestService";
import ReactPaginate from "react-paginate";

class UserInInterest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            interestId: this.props.match.params.interestId,
            userType: this.props.match.params?.type ? this.props.match.params?.type : "",
            userLists:[],
            userResults: {
                page: 1
            },
            isLoad: false,
        }

    }

    async componentDidMount() {
        await this.getUserLists();
    }

    getUserLists = async (page) => {
        this.setState({ isLoad: true });
        let filter = {};
        if(this.state.userType){
            filter.role = this.state.userType;
        }
        const get = await getUserByInterest(this.state.interestId, page, filter);
        if(get.status === "success"){
            this.setState({
                userLists: get.data.results,
                userResults: get.data,
                isLoad: false
            });
        }
        this.setState({ isLoad: false });
    }

    handlePageClick = (e) => {
        let page = e.selected + 1;
        this.getUserLists(page);
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
                        HeaderText="Interest"
                        Breadcrumb={[
                            {name: "Interest", navigate: "interest"},
                            {name: "User In Interest", navigate: ""},
                        ]}
                    />
                    <div className="row clearfix">
                        <div className="card">
                            <div className="header">
                                <h2>
                                    {
                                        this.state.userType === "vendor" ?
                                            <>
                                                Vendor In Interest
                                            </>
                                            :
                                            <>
                                                User In Interest
                                            </>
                                    }
                                </h2>
                            </div>
                            <div className="body table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Username</th>
                                        <th>Phone</th>
                                        <th>User Type</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.userLists.map((user ,index) =>
                                            <tr key={user.id}>
                                                <td>{ index+1 }</td>
                                                <td>{ user.name }</td>
                                                <td>{ user.email }</td>
                                                <td>{ user.username }</td>
                                                <td>{ user.mobile_number }</td>
                                                <td className="text-capitalize">
                                                    {
                                                        user.role == "user" ? "Individual" : user.role
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                                <div className="float-right">
                                    <ReactPaginate breakLabel="..."
                                                   nextLabel="Next"
                                                   containerClassName="pagination"
                                                   className="pagination"
                                                   pageClassName="page-item"
                                                   pageLinkClassName="page-link"
                                                   activeClassName="active"
                                                   previousClassName="page-item"
                                                   nextClassName="page-item"
                                                   previousLinkClassName="page-link"
                                                   nextLinkClassName="page-link"
                                                   breakClassName="page-item"
                                                   breakLinkClassName="page-link"
                                                   onPageChange={(e) => {
                                                       this.handlePageClick(e)
                                                   }}
                                                   pageRangeDisplayed={5}
                                                   forcePage={this.state.userResults.page - 1}
                                                   pageCount={this.state.userResults.totalPages}
                                                   previousLabel="Previous"
                                                   renderOnZeroPageCount={null}/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        )
    }
}

export default UserInInterest;