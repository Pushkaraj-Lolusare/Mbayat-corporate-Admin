import React,{Component} from "react";
import {orderList} from "../../services/orderServices/orderService";
import moment from 'moment';
import ReactPaginate from "react-paginate";
import {Link} from "react-router-dom";
import {getAllVendors, userList} from "../../services/userServices/userService";
import * as XLSX from "xlsx";

class OrderTable extends Component{

    constructor(props) {
        super(props);

        this.state = {
            orderLists: [],
            orderResults: {},
            startIndex: "",
            vendorLists: [],
            orderType: this.props.orderType ?? "",
        }
    }

    async componentDidMount() {
        await this.getOrders(1,{});
        await this.getVendorLists();
    }

    getOrders = async (page, filter) => {
        filter.orderType = this.state.orderType;
        const get = await orderList(page, filter);
        if(get.status === "success"){
            this.setState({
                orderLists: get.data,
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
        await this.getOrders(this.state.orderResults?.page,{
            orderType: e.target.value
        });
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
                <div className="col-lg-12">
                    <div className="card">
                        <div className="header pb-0">
                            <h2>
                                {this.props.title}{" "}
                                <small>
                                    Here is all orders from app
                                </small>
                            </h2>
                            <div className='row pt-5'>
                                <div className={'col-md-9'}></div>
                                <div className='col-md-2'>
                                    <select className='form-control' name={'filter-user'}>
                                        <option value={''}>Select Vendor</option>
                                        {
                                            this.state.vendorLists.map((item) =>
                                                <option value={item.id}>{item.first_name + ' ' + item.last_name}</option>
                                            )
                                        }
                                    </select>
                                </div>
                                <div className="col-md-1">
                                    <button className="btn btn-secondary float-right" onClick={() => this.exportTableToExcel('orderTableId', 'individualOrders')}> Export </button>
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
                                        <th>Order Date</th>
                                        <th>Order Status</th>
                                        <th>Order Type</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.orderLists.map((order, index) =>
                                            <tr key={order.order.id}>
                                                <td>{Number(this.state.startIndex) + index + 1}</td>
                                                <td>Test Vendor</td>
                                                <td>{ order?.order.userId?.first_name + ' ' +  order?.order.userId?.last_name }</td>
                                                {/*<td>Hair Oil</td>*/}
                                                {/*<td>Cosmetic</td>*/}
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
            </>
        )
    }

}

export default OrderTable;