import React,{Component} from "react";
import {getSubScriptionLists, getUserMysteryBoxData, userDetails} from "../../services/userServices/userService";
import PageHeader from "../../components/PageHeader";
import moment from "moment";
import ReactPaginate from "react-paginate";
import {getUserOrderLists} from "../../services/orderServices/orderService";
import {Link} from "react-router-dom";
import * as XLSX from "xlsx";

class ViewUserDetails extends Component{
    constructor(props) {
        super(props);

        this.state = {
            userId: this.props?.match?.params?.userId,
            userDetails: {},
            subscriptionLists: [],
            subscriptionResults: {},
            orderLists: [],
            orderResults: {},
            mysteryBoxLists: [],
            mysteryBoxResults: {},

        }
    }

    async componentDidMount() {
        const getDetails = await userDetails(this.state.userId);
        if(getDetails.status === 'success'){
            this.setState({
                userDetails: getDetails?.data,

            });
        }
        await this.loadSubscriptions();
        await this.loadUserOrders();
        await this.loadUserMysteryBoxLists();
    }

    loadSubscriptions = async (page = 1) => {
        const get = await getSubScriptionLists(this.state.userId, page);
        if(get.status === "success"){
            this.setState({
                subscriptionLists: get.results,
                subscriptionResults: get,
            });
        }
    }

    loadUserOrders = async (page = 1) => {
        const get = await getUserOrderLists(this.state.userId,page);
        if(get.status === "success"){
            this.setState({
                orderLists: get.data,
                orderResults: get,
            });
        }
    }

    loadUserMysteryBoxLists = async (page = 1) => {
        const get = await getUserMysteryBoxData(this.state.userId, page);
        if(get.status === "success"){
            this.setState({
                mysteryBoxLists: get.data,
                mysteryBoxResults: get,
            });
        }
    }

    handlePageClick = async (e) => {
        let page = e.selected + 1;
        await this.loadSubscriptions(page);
    }

    handleOrderPageClick = async (e) => {
        let page = e.selected + 1;
        await this.loadUserOrders(page);
    }

    handleMysteryBoxClick = async (e) => {
        let page = e.selected + 1;
        await this.loadUserMysteryBoxLists(page);
    }

    exportTableToExcel = (tableId, fileName = 'excelData') => {
        const table = document.getElementById(tableId);
        const cloneTable = table.cloneNode(true);
        const rows = cloneTable.querySelectorAll('tr');

        // Remove the action column from each row
        rows.forEach((row) => {
            row.removeChild(row.lastChild);
        });

        const wb = XLSX.utils.table_to_book(cloneTable, { sheet: 'SheetJS' });
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        const s2ab = (s) => {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i += 1) {
                view[i] = s.charCodeAt(i) & 0xff;
            }
            return buf;
        };

        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `${fileName}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    render() {
        return (
            <>
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="User Details"
                        Breadcrumb={[
                            { name: "Users", navigate: "/registered-users" },
                        ]}
                    />

                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="header pb-0">
                                    <h2>
                                        User Details
                                    </h2>
                                </div>
                                <div className="container-fluid">
                                    <div className='row pt-5 pb-5'>
                                        <div className="col-md-3">
                                            <label>UserId</label>
                                            <p>{ this.state.userDetails.id }</p>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Name</label>
                                            <p>{ this.state.userDetails.first_name + ' ' + this.state.userDetails.last_name }</p>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Mobile Number</label>
                                            <p>{ this.state.userDetails.country_code  + ' ' + this.state.userDetails.mobile_number }</p>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Email</label>
                                            <p>{ this.state.userDetails.email }</p>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Interests</label>
                                            <div className="d-flex">
                                                {
                                                    this.state.userDetails.interests && this.state.userDetails.interests.map((interest, index) =>
                                                        <p>{interest.name}{ this.state.userDetails.interests.length !== (index + 1) ? ", \u00A0 " : "" } </p>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Sub Interests</label>
                                            <div className="d-flex">
                                                {
                                                    this.state.userDetails.subInterests && this.state.userDetails.subInterests.map((interest, index) =>
                                                        <p>{interest.name}{ this.state.userDetails.subInterests.length !== (index + 1) ? ", \u00A0 " : "" } </p>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Gender</label>
                                            <p>{ this.state.userDetails.gender ?? "-" }</p>
                                        </div>
                                        <div className="col-md-3">
                                            <label>User Type</label>
                                            <p className="text-capitalize">{ this.state.userDetails?.role === "user" ? "Individual" : this.state.userDetails?.role }</p>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Subscription Status</label>
                                            <p className="text-capitalize">{ this.state.userDetails?.isSubscribed ? "Subscribed" : "Not Subscribed" }</p>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Date Of Birth</label>
                                            <p className="text-capitalize">{ this.state.userDetails?.date_of_birth ? this.state.userDetails?.date_of_birth : "" }</p>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Status</label>
                                            <p className="text-capitalize">{ this.state.userDetails?.status }</p>
                                        </div>
                                        {
                                            this.state.userDetails?.role === "vendor" && (
                                                <>
                                                    <div className="col-md-3">
                                                        <label>Website Link</label>
                                                        <p className="text-capitalize">
                                                            {
                                                                this.state.userDetails?.websiteLink !== undefined && this.state.userDetails?.websiteLink !== "" && (
                                                                    <a href={ this.state.userDetails?.websiteLink } target="_blank">View</a>
                                                                )
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label>Instagram Link</label>
                                                        <p className="text-capitalize">
                                                            {
                                                                this.state.userDetails?.instagramLink !== undefined && this.state.userDetails?.instagramLink !== "" && (
                                                                    <a href={ this.state.userDetails?.instagramLink } target="_blank">View</a>
                                                                )
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label>Company Logo</label>
                                                        <p className="text-capitalize">
                                                            {
                                                                this.state.userDetails?.companyLogo !== undefined && this.state.userDetails?.instagramLink !== "" && (
                                                                    <img src={ this.state.userDetails?.companyLogo } height={200} />
                                                                )
                                                            }
                                                        </p>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="header pb-0">
                                    <h2>
                                        Subscription Details
                                    </h2>
                                    <button className="btn btn-secondary float-right" onClick={() => this.exportTableToExcel('subscriptionTableId', 'subscriptionData')}> Export </button>
                                </div>
                                <div className="body">
                                    <div className="body table-responsive">
                                        <table className="table" id="subscriptionTableId">
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Subscription Duration</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Remains Days</th>
                                                <th>Total Months</th>
                                                <th>Total Paid Amount</th>
                                                <th>Status</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.subscriptionLists.map((item, index) =>
                                                    <tr key={item.id}>
                                                        <td>{index+1}</td>
                                                        <td>{item.subscriptionType}</td>
                                                        <td>{ moment(item.startDate).format('Y-MM-D') }</td>
                                                        <td>{ moment(item.endDate).format('Y-MM-D') }</td>
                                                        <td>
                                                            {
                                                                item.status === "running" && (
                                                                    moment(item.endDate).diff(moment(item.startDate), 'days')
                                                                )
                                                            }
                                                        </td>
                                                        <td>{item.totalMonths}</td>
                                                        <td>{item.totalPaidAmount}</td>
                                                        <td className="text-capitalize">{item.status}</td>
                                                    </tr>
                                                )
                                            }
                                            </tbody>
                                        </table>
                                        <div className="float-right">
                                            {
                                                this.state.subscriptionResults.page !== undefined && (
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
                                                                   forcePage={this.state.subscriptionResults?.page - 1}
                                                                   pageCount={this.state.subscriptionResults?.totalPages}
                                                                   previousLabel="Previous"
                                                                   renderOnZeroPageCount={null}/>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="header pb-0">
                                    <h2>
                                        Orders Details
                                    </h2>
                                    <button className="btn btn-secondary float-right" onClick={() => this.exportTableToExcel('orderTableId', 'orderData')}> Export </button>
                                </div>
                                <div className="body">
                                    <div className="body table-responsive">
                                        <table className="table" id="orderTableId">
                                            <thead>
                                            <tr>
                                                <th>Vendor Name</th>
                                                <th>Product Name</th>
                                                <th>Order Date</th>
                                                <th>Order Status</th>
                                                <th>Order Type</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.orderLists.map((order, index) =>
                                                    <tr key={order.order.id}>
                                                        <td>{ order.order.vendorId?.first_name + ' ' + order.order.vendorId?.last_name }</td>
                                                        <td>{ order?.order.productId?.name}</td>
                                                        <td>
                                                            {
                                                                moment(order.order.createdAt).format('MM-DD-Y')
                                                            }
                                                        </td>
                                                        <td>{
                                                            order?.order?.shippingStatus
                                                        }</td>
                                                        <td>{
                                                            order?.order?.orderType
                                                        }</td>
                                                        <td className="text-center">
                                                            <Link to={'/order-details/' + order?.order.id}>
                                                                <button className="btn btn-info">
                                                                    <i className={'icon-eye'}></i>
                                                                </button>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                            </tbody>
                                        </table>
                                        <div className="float-right">
                                            {
                                                this.state.orderResults.page !== undefined && (
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
                                                                       this.handleOrderPageClick(e)
                                                                   }}
                                                                   pageRangeDisplayed={5}
                                                                   forcePage={this.state.orderResults?.page - 1}
                                                                   pageCount={this.state.orderResults?.totalPages}
                                                                   previousLabel="Previous"
                                                                   renderOnZeroPageCount={null}/>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="header pb-0">
                                    <h2>
                                        Mystery Box Details
                                    </h2>
                                    <button className="btn btn-secondary float-right" onClick={() => this.exportTableToExcel('mysteryBoxDetailId', 'orderData')}> Export </button>
                                </div>
                                <div className="body">
                                    <div className="body table-responsive">
                                        <table className="table" id="mysteryBoxDetailId">
                                            <thead>
                                            <tr>
                                                <th>Vendor Name</th>
                                                <th>Product Name</th>
                                                <th>Order Date</th>
                                                <th>Order Status</th>
                                                <th>Order Type</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.mysteryBoxLists.map((order, index) =>
                                                    <tr key={order.id}>
                                                        <td>{ order.vendorId?.first_name + ' ' + order.vendorId?.last_name }</td>
                                                        <td>{ order?.productId?.name}</td>
                                                        <td>
                                                            {
                                                                moment(order.createdAt).format('MM-DD-Y')
                                                            }
                                                        </td>
                                                        <td className="text-capitalize">{
                                                            order?.status
                                                        }</td>
                                                        <td>Mystery Box</td>
                                                        {/*<td className="text-center">*/}
                                                        {/*    <Link to={'/order-details/' + order?.order.id}>*/}
                                                        {/*        <button className="btn btn-info">*/}
                                                        {/*            <i className={'icon-eye'}></i>*/}
                                                        {/*        </button>*/}
                                                        {/*    </Link>*/}
                                                        {/*</td>*/}
                                                    </tr>
                                                )
                                            }
                                            </tbody>
                                        </table>
                                        <div className="float-right">
                                            {
                                                this.state.mysteryBoxResults.page !== undefined && (
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
                                                                       this.handleMysteryBoxClick(e)
                                                                   }}
                                                                   pageRangeDisplayed={5}
                                                                   forcePage={this.state.mysteryBoxResults?.page - 1}
                                                                   pageCount={this.state.mysteryBoxResults?.totalPages}
                                                                   previousLabel="Previous"
                                                                   renderOnZeroPageCount={null}/>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default ViewUserDetails;