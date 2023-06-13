import React,{Component} from "react";
import PageHeader from "../../components/PageHeader";
import OrderTable from "../Tables/OrderTable";
import {orderList} from "../../services/orderServices/orderService";
import {getAllMysteryBoxOrders, getAllVendors} from "../../services/userServices/userService";
import moment from "moment/moment";
import {Link} from "react-router-dom";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";

class MysteryBoxOrderList extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isLoad: false,
            vendorLists: [],
            orderLists: [],
            orderResults: {},
            startIndex: "",
            orderType: "upcoming",
            selectedVendor: "",
        }
    }

    async componentDidMount() {
        await this.getOrders(1,{});
        await this.getVendorLists();
    }

    getOrders = async (page, filter = {}) => {
        filter.orderType = this.state.orderType;
        filter.vendorId = this.state.selectedVendor;
        const get = await getAllMysteryBoxOrders(page, filter);

        if(get.results !== undefined){
            this.setState({
                orderLists: get.results,
                orderResults: get,
                startIndex: (get?.page - 1) * get?.limit
            });
        }else{
            this.setState({
                orderLists: [],
                orderResults: {}
            });
        }
    }

    getVendorLists = async () => {
        const get = await getAllVendors(1,1000);
        if(get.status === "success"){
            this.setState({
                vendorLists: get.results,
            })
        }
    }

    handlePageClick = async (e) => {
        let page = e.selected + 1;
        await this.getOrders(page);
    }

    filterOrderType = async (e) => {
        let status = e.target.value;
        this.setState({
            orderType: status,
        });
        setTimeout(async () => {
            await this.getOrders(1);
        }, 500);
    }

    onVendorChange = async (e) => {
        let vendorId = e.target.value;
        this.setState({
            selectedVendor: vendorId,
        });
        setTimeout(async () => {
            await this.getOrders(1);
        }, 500);
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
            <div>
                <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
                    <div className="loader">
                        <div className="m-t-30"><img src={require('../../assets/images/logo-icon.svg')} width="48" height="48" alt="Lucid" /></div>
                        <p>Please wait...</p>
                    </div>
                </div>
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="Mystery Box Orders"
                        Breadcrumb={[
                            { name: "Orders", navigate: "/order-list" },
                        ]}
                    />
                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="header pb-0">
                                    <h2>
                                        Mystery Box Orders
                                        <small>
                                            Here is all orders from app
                                        </small>
                                    </h2>
                                    <div className='row pt-5'>
                                        <div className={'col-md-7'}></div>
                                        <div className="col-md-2">
                                            <select className="form-control" value={this.state.orderType} onChange={ (e) => { this.filterOrderType(e) } } >
                                                <option value="">Select Mystery Box Status</option>
                                                <option value="upcoming">Upcoming</option>
                                                <option value="history">History</option>
                                            </select>
                                        </div>
                                        <div className='col-md-2'>
                                            <select className='form-control' name={'filter-user'} value={this.state.selectedVendor} onChange={ (e) => { this.onVendorChange(e) } } >
                                                <option value={''}>Select Vendor</option>
                                                {
                                                    this.state.vendorLists.map((item) =>
                                                        <option value={item.id}>{item.first_name + ' ' + item.last_name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="col-md-1">
                                            <button className="btn btn-secondary float-right" onClick={() => this.exportTableToExcel('orderTableId', 'mysteryBoxData')}> Export </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='card-body'>
                                    <div className="body table-responsive">
                                        <table className="table" id="orderTableId">
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Vendor Name</th>
                                                <th>Customer Name</th>
                                                {/*<th>Product</th>*/}
                                                {/*<th>Product Category</th>*/}
                                                <th>Product Name</th>
                                                <th>Order Date</th>
                                                <th>Order Status</th>
                                                {/*<th className="text-center">Actions</th>*/}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.orderLists.map((order, index) =>
                                                    <tr key={order.id}>
                                                        <td>{Number(this.state.startIndex) + index + 1}</td>
                                                        <td>{ order?.vendorId?.first_name + ' ' + order?.vendorId?.last_name }</td>
                                                        <td>{ order?.userId?.first_name + ' ' +  order?.userId?.last_name }</td>
                                                        <td>{
                                                            order?.productId?.name
                                                        }</td>

                                                        <td>
                                                            {
                                                                moment(order.createdAt).format('MM-DD-Y')
                                                            }
                                                        </td>
                                                        <td className="text-capitalize">{
                                                            order?.status
                                                        }</td>
                                                        {/*<td className="text-center">*/}
                                                        {/*    <button className="btn btn-outline-info">*/}
                                                        {/*        <i className={'icon-check'}></i>*/}
                                                        {/*    </button>*/}
                                                        {/*</td>*/}
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
                                                                       this.handlePageClick(e)
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
                </div>
            </div>
        )
    }
}

export default MysteryBoxOrderList;