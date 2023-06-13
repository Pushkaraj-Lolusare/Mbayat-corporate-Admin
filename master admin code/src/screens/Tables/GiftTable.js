import React,{Component} from "react";
import moment from 'moment';
import ReactPaginate from "react-paginate";
import {giftLists} from "../../services/giftServices/giftService";
import * as XLSX from "xlsx";

class GiftTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            giftLists: [],
            giftResults: {},
            startIndex: 0,
            selectedType: "",
            orderType: "",
        }
    }

    async componentDidMount() {
        await this.getGiftLists();
    }

    getGiftLists = async (page = 1, filter = null) => {
        const getGifts = await giftLists(page, filter);
        if(getGifts.status === "success"){
            this.setState({
                giftLists: getGifts.data.results,
                giftResults: getGifts.data,
                startIndex: (page - 1) * getGifts.data.limit,
            });
        }
    }

    handlePageClick = async (e) => {
        let page = e.selected + 1;
        await this.getGiftLists(page);
    }

    changeGiftType = async (e) => {
        let targetValue = e.target.value;
        this.setState({
            selectedType: targetValue,
        });
        if(targetValue !== ""){
            let sentObject = {
                giftType: targetValue,
            };
            if(this.state.orderType){
                sentObject.sentType = this.state.orderType;
            }
            await this.getGiftLists(1, sentObject);
        }else{
            await this.getGiftLists(1);
        }
    }

    orderFilter = async (e) => {
        let targetValue = e.target.value;
        this.setState({
            orderType: targetValue,
        });
        if(targetValue !== ""){

            let sentObject = {
                sentType: targetValue,
            };
            if(this.state.selectedType){
                sentObject.giftType = this.state.selectedType;
            }

            await this.getGiftLists(1, sentObject);
        }else{
            await this.getGiftLists(1);
        }
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
                                Gift List Table{" "}
                            </h2>
                            <div className="row">
                                <div className="col-md-7"></div>
                                <div className="col-md-2">
                                    <select className="form-control" value={this.state.orderType} onChange={ (e) => { this.orderFilter(e) } }>
                                        <option value="">Select Order Type</option>
                                        <option value="individual">Individual</option>
                                        <option value="corporate">Corporate</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <select className="form-control" value={this.state.selectedType} onChange={ (e) => { this.changeGiftType(e) } }>
                                        <option value="">Select Gift Type</option>
                                        <option value="Box">Gift</option>
                                        <option value="Subscription">Subscription</option>
                                    </select>
                                </div>
                                <div className="col-md-1">
                                    <button className="btn btn-secondary float-right" onClick={() => this.exportTableToExcel('giftTable', 'giftData')}> Export </button>
                                </div>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className="body table-responsive">
                                <table className="table" id="giftTable">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Sender Name</th>
                                        <th>Receiver Name</th>
                                        <th>Gift Type</th>
                                        <th>Gifted Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.giftLists.map((item, index) =>
                                            <tr key={item.id}>
                                                <td>{this.state.startIndex + index + 1}</td>
                                                <td>{ item.giftSenderUserId !== null && (item.giftSenderUserId?.first_name + ' ' + item.giftSenderUserId?.last_name) }</td>
                                                <td>{ item.giftReceiverUserId !== null && (item.giftReceiverUserId?.first_name + ' ' + item.giftReceiverUserId?.last_name) }</td>
                                                <td>{
                                                    item.giftType === "Subscription" ?
                                                        <>
                                                        {item.giftType} ({item?.giftSubscriptionId?.totalMonths} {item?.giftSubscriptionId?.totalMonths > 1 ? "Months" : "Month"})
                                                        </>
                                                        :
                                                        <>{item.giftType}</>
                                                }</td>
                                                <td>
                                                    {
                                                        moment(item.createdAt).format('MM-DD-Y')
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                                <div className="float-right">
                                    {
                                        this.state.giftResults.page !== undefined && (
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
                                                           forcePage={this.state.giftResults?.page - 1}
                                                           pageCount={this.state.giftResults?.totalPages}
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

export default GiftTable;