import React, { Component } from 'react'
import {getSubInterest} from "../../services/InterestServices/interestService";
import PageHeader from "../../components/PageHeader";
import * as XLSX from "xlsx";

class SubInterest extends Component{
    constructor(props) {
        super(props);

        this.state = {
            interestId: props.match.params.interestId ?? "",
            interestLists: [],
        }
    }

    async componentDidMount() {
        await this.loadSubInterest();
    }

    loadSubInterest = async () => {
        const get = await getSubInterest(this.state.interestId);
        if(get.status === "success"){
            this.setState({
                interestLists: get.data,
            });
        }
    }

    exportTableToExcel = (tableId, fileName = 'excelData') => {
        const table = document.getElementById(tableId);
        const cloneTable = table.cloneNode(true);
        // const rows = cloneTable.querySelectorAll('tr');

        // Remove the action column from each row
        // rows.forEach((row) => {
        //     row.removeChild(row.lastChild);
        // });

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
                <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
                    <div className="loader">
                        <div className="m-t-30"><img src={require('../../assets/images/logo-icon.svg')} width="48" height="48" alt="Lucid" /></div>
                        <p>Please wait...</p>
                    </div>
                </div>
                <div className="container-fluid">
                    <PageHeader
                        HeaderText="Sub Interest"
                        Breadcrumb={[
                            { name: "Interest", navigate: "interest" },
                        ]}
                    />
                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="header">
                                    <h2>
                                        Sub Interest Table{" "}
                                        <small>
                                            Here is selected sub interest list
                                        </small>
                                    </h2>
                                    <button className="btn btn-secondary float-right" onClick={() => this.exportTableToExcel('subInterstTableId', 'subInterestData')}> Export </button>
                                </div>
                                <div className="body table-responsive">
                                    <table className="table" id="subInterstTableId">
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.interestLists.map((item,index) =>
                                                <tr key={item.id}>
                                                    <td>{index+1}</td>
                                                    <td>{item.name}</td>
                                                </tr>
                                            )
                                        }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default SubInterest;