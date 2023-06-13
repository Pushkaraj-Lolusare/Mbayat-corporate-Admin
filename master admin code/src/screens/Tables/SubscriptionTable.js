import React,{Component} from "react";
import {Link} from "react-router-dom";
import {getSubscriptionLists, updatePlan} from "../../services/subscriptions/subscriptionService";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

class SubscriptionTable extends Component{
    constructor(props) {
        super(props);

        this.state = {
            planLists: [],
        }
    }

    async componentDidMount() {
        await this.loadPlans();
    }

    loadPlans = async () => {
        const get = await getSubscriptionLists();
        if(get.status === "success"){
            this.setState({
                planLists: get.data,
            });
        }
    }

    deletePlan = (planId) => {
        Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "Are you sure want to delete this plan?",
            showCancelButton: true,
            cancelButtonText: "No",
            confirmButtonText: "Yes"
        }).then( async (res) => {
            if(res.isConfirmed){
                const update = await updatePlan({ planId, status: "in_active" });
                if(update.status === "success"){
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: update.message
                    }).then(async (ok) => {
                        if(ok.isConfirmed){
                            await this.loadPlans();
                        }
                    });
                }else{
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: update.message
                    });
                }
            }
        })
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
        return(
            <>
                <div className="col-lg-12">
                    <div className="card">
                        <div className="header pb-0">
                            <h2>
                                Subscription Table{" "}
                            </h2>
                            <div className='row'>
                                <div className="col-md-10"></div>
                                <div className="col-md-2">
                                    <button className="btn btn-secondary float-right" onClick={() => this.exportTableToExcel('subscriptionTable', 'subscriptionData')}> Export </button>
                                    <Link to="/create-subscription">
                                        <button className="btn btn-info float-right mr-4">Create Plan</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="body table-responsive">
                                <table className="table" id="subscriptionTable">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Plan Name</th>
                                        <th>Plan Price</th>
                                        <th>Plan Duration</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.planLists.map((data, index)  =>
                                            <tr>
                                                <td>{ index + 1 }</td>
                                                <td>{ data.planName }</td>
                                                <td>{ data.planPrice }</td>
                                                <td>{ data.planDuration } { data.planDuration > 1 ? ' Months' : ' Month' }</td>
                                                <td className="text-center">
                                                    <Link to={'/edit-subscription/' + data.id}>
                                                        <button className="btn btn-info"> <i class="fa fa-pencil"></i> </button>
                                                    </Link>
                                                    &nbsp;
                                                    <button className="btn btn-danger" onClick={ () => { this.deletePlan(data.id) } }> <i class="fa fa-trash"></i> </button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default SubscriptionTable;