import React,{Component} from "react";
import moment from 'moment';
import ReactPaginate from "react-paginate";
import {changePaymentStatus, paymentLists} from "../../services/paymentServices/paymentService";
import swal from "sweetalert2";
import {getAllVendors} from "../../services/userServices/userService";
import * as XLSX from "xlsx";

class PaymentTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            paymentLists: [],
            paymentResults: {},
            startIndex: 0,
            vendorId: 0,
            dateRange: "",
            vendorLists: [],
            selectedVendorId: "",
            selectedMonth: "",
        }
    }

    async componentDidMount() {
        await this.getPaymentList();
        await this.getVendorLists();
    }

    getVendorLists = async () => {
        const get = await getAllVendors(1,1000);
        if(get.status === "success"){
            this.setState({
                vendorLists: get.results,
            })
        }
    }

    getPaymentList = async (page = 1) => {
        const filter = {
            vendorId: this.state.selectedVendorId,
            paymentMonths: this.state.selectedMonth,
        };
        const getPayment = await paymentLists(page, filter);
        if(getPayment.status === "success"){
            this.setState({
                paymentLists: getPayment.data.results,
                paymentResults: getPayment.data,
                startIndex: (page - 1) * getPayment.data.limit,
            });
        }
    }

    handlePageClick = (e) => {
        let page = e.selected + 1;
        this.getPaymentList(page);
    }

    changePaymentStatus = async (e,userId,paymentId) => {
        const value = e.target.value;
        const data = {
            userId,
            paymentId,
            status: value,
        }

        const changePayment = await changePaymentStatus(data);
        if(changePayment.status === "success"){
            swal.fire({
                icon: "success",
                title: "Success!",
                text: changePayment.message
            });
        }else{
            swal.fire({
                icon: "error",
                title: "Error!",
                text: changePayment.message
            });
        }
    }

    onChangeMonth = async (e) => {
        this.setState({
            selectedMonth: e.target.value,
        });
        setTimeout(async () => {
            await this.getPaymentList();
        }, 500);
    }

    onChangeVendor = async (e) => {
        this.setState({
            selectedVendorId: e.target.value,
        });

        setTimeout(async () => {
            await this.getPaymentList();
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
            <>
                <div className="col-lg-12">
                    <div className="card">
                        <div className="header pb-0">
                            <h2>
                                Payment List Table{" "}
                            </h2>
                            <div className='row pt-5'>
                                <div className={'col-md-7'}></div>
                                <div className='col-md-2'>
                                    <select className='form-control' name={'filter-user'} onChange={ (e) => { this.onChangeMonth(e) } } >
                                        <option value="">Select Month</option>
                                        <option value="01">January</option>
                                        <option value="02">February</option>
                                        <option value="03">March</option>
                                        <option value="04">April</option>
                                        <option value="05">May</option>
                                        <option value="06">June</option>
                                        <option value="07">July</option>
                                        <option value="08">August</option>
                                        <option value="09">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                </div>
                                <div className='col-md-2'>
                                    <select className='form-control' name={'filter-user'} onChange={ (e) => { this.onChangeVendor(e) } } >
                                        <option value={''}>Select Vendor</option>
                                        {
                                            this.state.vendorLists.map((item) =>
                                                <option value={item.id}>{item.first_name + ' ' + item.last_name}</option>
                                            )
                                        }
                                    </select>
                                </div>
                                <div className="col-md-1">
                                    <button className="btn btn-secondary float-right" onClick={() => this.exportTableToExcel('paymentTableId', 'paymentData')}> Export </button>
                                </div>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className="body table-responsive">
                                <table className="table" id="paymentTableId">
                                    <thead>
                                    <tr>
                                        <th>Payment Id</th>
                                        <th>Vendor Name</th>
                                        <th>Product Name</th>
                                        <th>Order Date</th>
                                        <th>Customer Info</th>
                                        <th>Price</th>
                                        <th>Payment Status</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.paymentLists.map((item, index) =>
                                            <tr key={item.id}>
                                                <td>{this.state.startIndex + index + 1}</td>
                                                <td>Test Vendor</td>
                                                <td>Test Product</td>
                                                <td>
                                                    {
                                                        moment(item.createdAt).format('MM-DD-Y')
                                                    }
                                                </td>
                                                <td>{
                                                    item?.userId?.first_name + ' ' + item?.userId?.last_name
                                                }</td>
                                                <td>{
                                                    item?.price
                                                }</td>
                                                <td className="text-capitalize text-center">
                                                    <select style={{width: "60%"}} className="form-control"
                                                            defaultValue={item?.paymentStatus}
                                                            onChange={(e) => {
                                                                this.changePaymentStatus(e,item?.userId?.id,item.id)
                                                            }} >
                                                        <option value="paid">Paid</option>
                                                        <option value="unpaid">UnPaid</option>
                                                    </select>
                                                </td>
                                                <td className="text-center">
                                                    <button className="btn btn-info">
                                                        <i className={'icon-pencil'}></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                                <div className="float-right">
                                    {
                                        this.state.paymentResults.page !== undefined && (
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
                                                           forcePage={this.state.paymentResults?.page - 1}
                                                           pageCount={this.state.paymentResults?.totalPages}
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

export default PaymentTable;