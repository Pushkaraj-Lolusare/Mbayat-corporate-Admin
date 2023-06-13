import React,{Component} from "react";
import {Link} from "react-router-dom";
import ReactPaginate from "react-paginate";
import {ratingList} from "../../services/rattingServices/ratingService";

class RatingTable extends Component{
    constructor(props) {
        super(props);

        this.state = {
            ratingLists: [],
            ratingResults: {},
            startIndex: 0,
        }
    }

    async componentDidMount() {
        await this.getRatingLists();
    }

    getRatingLists = async (page = 1) => {
        const getList = await ratingList(page);
        if(getList){
            this.setState({
                ratingLists: getList.data?.results,
                ratingResults: getList.data,
                startIndex: (page - 1) * getList.data.limit
            });
        }
    }

    handlePageClick = async (e) => {
        let page = e.selected + 1;
        await this.getRatingLists(page);
    }

    render() {
        return(
            <>
                <div className="col-lg-12">
                    <div className="card">
                        <div className="header pb-0">
                            <h2>
                                Rating Table{" "}
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="body table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>User Name</th>
                                        <th>Product Name</th>
                                        <th>Review</th>
                                        <th>Total Rating</th>
                                    </tr>
                                    {
                                        this.state.ratingLists.map((item, index) =>
                                            <tr key={item.id}>
                                                <td>{this.state.startIndex + index + 1}</td>
                                                <td>{item.userId.first_name + ' ' + item.userId.last_name }</td>
                                                <td>Test Product</td>
                                                <td>{ item.review }</td>
                                                <td>{ item.rating }</td>
                                            </tr>
                                        )
                                    }
                                    </thead>
                                </table>
                                <div className="float-right">
                                    {
                                        this.state.ratingResults.page !== undefined && (
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
                                                           forcePage={this.state.ratingResults?.page - 1}
                                                           pageCount={this.state.ratingResults?.totalPages}
                                                           previousLabel="Previous"
                                                           renderOnZeroPageCount={null}/>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default RatingTable;