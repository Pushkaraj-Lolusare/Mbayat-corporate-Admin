import React from "react";
import swal from "sweetalert2";
import {Link} from "react-router-dom";
import {deleteUser} from "../../services/userServices/userService";
import ReactPaginate from "react-paginate";
import Cookies from "universal-cookie";
import moment from "moment";
import {interestLists} from "../../services/InterestServices/interestService";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

class UserTable extends React.Component {

    constructor(props) {
        super(props);
        const cookies = new Cookies();

        this.state = {
            userList: props.userList.results,
            userResult: this.props.userList || {},
            userDetails: cookies.get('user') ? cookies.get('user') : {},
            permission: cookies.get('user')?.permissions || [],
            startIndex: (this.props.userList?.page - 1) * this.props.userList?.limit,
            interestLists: [],
            selectedInterest: this.props.interestId,
            userType: this.props.userType,
            userGender: this.props.userGender,
            status:this.props.status,
        }
    }

    async componentDidMount() {
        this.getInterestLists();
    }

    getInterestLists = async () => {
        const get = await interestLists("", "", "all");
        if (get.results !== undefined) {
            this.setState({
                interestLists: get.results,
            })
        }
    }

    deleteUser = (userId) => {
        swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Are you sure want to remove this user?',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes'
        }).then(async (ok) => {
            if (ok.isConfirmed) {
                const remove = await deleteUser(userId);
                if (remove.status === "success") {
                    await swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: remove.message
                    });
                    this.props.loadUser();
                }
            }
        });
    }

    handlePageClick = (e) => {
        let page = e.selected + 1;
        this.props.loadUser(page, 10, this.state.selectedInterest);
    }

    getModulePermission = (moduleName) => {
        let permission = {};
        let userPermission = this.state.permission;
        permission = userPermission.find((value) => value[moduleName]);
        return permission;
    }

    onInterestChange = async (e) => {
        let interestId = e.target.value;

        this.setState({
            selectedInterest: interestId
        });
        await this.props.loadUser(1, 10, interestId);
    }

    onChangeUserType = async (e) => {
        let userType = e.target.value;

        this.setState({
            userType: userType
        });
        await this.props.loadUser(1, 10, this.state.selectedInterest, userType);
    }

    onChangeUserGender = async (e) => {
        let userGender = e.target.value;

        this.setState({
            userGender: userGender
        });
        await this.props.loadUser(1, 10, this.state.selectedInterest, this.state.userType, userGender);
    }

    onChangeUserStatus = async (e) => {
        let status = e.target.value;

        this.setState({
            status: status
        });
        await this.props.loadUser(1, 10, this.state.selectedInterest, this.state.userType, this.state.userGender,status);
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

    blockOrUnblock  = (userId,status) => {

        let warningMessage = 'Are you sure want to block this user?';
        let popupMessage = "";
        if(status === "active"){
            warningMessage = 'Are you sure want to block this user?';
            popupMessage = "User blocked successfully.";
        }

        if(status === "in_active"){
            warningMessage = 'Are you sure want to unblock this user?';
            popupMessage = "User unblocked successfully.";
        }

        swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: warningMessage,
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes'
        }).then(async (ok) => {
            if (ok.isConfirmed) {
                const remove = await deleteUser(userId);
                if (remove.status === "success") {
                    await swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: popupMessage
                    });
                    this.props.loadUser();
                }
            }
        });
    }

    render() {
        return (
            <div className="col-lg-12">
                <div className="card">
                    <div className="header">
                        <h2>
                            Users Table{" "}
                            <small>
                                Here is all registered users
                            </small>
                        </h2>
                        <div className="row">
                            <div className="col-md-9"></div>
                            <div className="col-md-3 mb-3">
                                <button className="btn btn-secondary float-right" onClick={() => this.exportTableToExcel('userTableId', 'userData')}> Export </button>
                                <Link to={'/add-vendor'}>
                                    <button className="btn btn-info float-right mr-4">Add Vendor</button>
                                </Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2"></div>
                            <div className="col-md-2">
                                <select className='form-control' onChange={(e) => { this.onChangeUserStatus(e) } } value={this.state.status}>
                                    <option value={''}>Filter By Status</option>
                                    <option value={'active'}>Active</option>
                                    <option value={'in_active'}>In Active</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <select className='form-control' onChange={(e) => { this.onChangeUserType(e) } } value={this.state.userType}>
                                    <option value={''}>Filter By User Type</option>
                                    <option value={'user'}>Individual</option>
                                    <option value={'vendor'}>Vendor</option>
                                    <option value={'corporate'}>Corporate</option>
                                    {/*<option value={'subscribed'}>Subscribed</option>*/}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <select className='form-control' onChange={ (e) => { this.onChangeUserGender(e) } } value={this.state.userGender}>
                                    <option value={''}>Filter By Gender</option>
                                    <option value={'Male'}>Male</option>
                                    <option value={'FeMale'}>FeMale</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <select className='form-control'>
                                    <option value={''}>Filter By Age</option>
                                    <option value={'20'}>20</option>
                                    <option value={'25'}>25</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <select className='form-control'
                                        onChange={(e) => {
                                            this.onInterestChange(e);
                                        }} value={this.state.selectedInterest}>
                                    <option value={''}>Filter By Interest</option>
                                    {
                                        this.state.interestLists.map((data) =>
                                            <option key={data.id} value={data.id} selected={this.state.selectedInterest === data.id}>{data.name}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="body table-responsive">
                        <table className="table" id="userTableId">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>User Type</th>
                                <th>Status</th>
                                <th>Register Date</th>
                                {
                                    this.state.userDetails?.role === 'admin_user' ?
                                        <>
                                            {
                                                this.getModulePermission('registeredUser').registeredUser.edit ||
                                                this.getModulePermission('registeredUser').registeredUser.delete ?
                                                    <th className="text-center">Actions</th> : ""
                                            }
                                        </>
                                        :
                                        <th className="text-center">Actions</th>
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.userList.map((data, index) =>
                                    <tr key={data.id}>
                                        <th scope="row">{this.state.startIndex + index + 1}</th>
                                        <td>{data?.first_name}</td>
                                        <td>{data?.last_name}</td>
                                        <td>{data?.email}</td>
                                        <td>{data?.mobile_number}</td>
                                        <td className="text-capitalize">{
                                            data?.role === "user" ? "Individual" : data?.role
                                        }</td>
                                        <td className="text-capitalize">{ data?.status.replace("_", " ") }</td>
                                        <td>{moment(data?.createdAt).format("Y-MM-DD")}</td>
                                        {
                                            this.state.userDetails?.role === 'admin_user' ?
                                                <>
                                                    {
                                                        (this.getModulePermission('registeredUser').registeredUser.edit ||
                                                            this.getModulePermission('registeredUser').registeredUser.delete) && (
                                                            <td className='text-center'>
                                                                {
                                                                    this.getModulePermission('registeredUser').registeredUser.edit && (
                                                                        <>
                                                                            {
                                                                                data.role === 'vendor' ?
                                                                                    <Link to={`edit-vendor/${data.id}`}>
                                                                                        <button type="button" className="btn btn-info mr-1"
                                                                                                title="Delete">
                                                                                            <span className="sr-only">Delete</span> <i
                                                                                            className="fa fa-pencil"></i>
                                                                                        </button>
                                                                                    </Link>
                                                                                    :
                                                                                    <Link to={`edit-user/${data.id}`}>
                                                                                        <button type="button" className="btn btn-info mr-1"
                                                                                                title="Delete">
                                                                                            <span className="sr-only">Delete</span> <i
                                                                                            className="fa fa-pencil"></i>
                                                                                        </button>
                                                                                    </Link>
                                                                            }
                                                                        </>
                                                                    )
                                                                }
                                                                {
                                                                    this.getModulePermission('registeredUser').registeredUser.delete && (
                                                                        <button type="button" className="btn btn-danger mr-1"
                                                                                title="Delete" onClick={() => {
                                                                            this.deleteUser(data.id)
                                                                        }}>
                                                                            <span className="sr-only">Delete</span> <i
                                                                            className="fa fa-trash-o"></i>
                                                                        </button>
                                                                    )
                                                                }
                                                            </td>
                                                        )
                                                    }
                                                </>
                                                :
                                                <td className="text-center">
                                                    <Link to={`view-user-details/${data.id}`}>
                                                        <button type="button" className="btn btn-default mr-1"
                                                                title="View">
                                                            <span className="sr-only">View</span> <i
                                                            className="fa fa-eye"></i>
                                                        </button>
                                                    </Link>
                                                    {
                                                        data.role === 'vendor' ?
                                                            <>
                                                            {
                                                                data.status === "active" ?
                                                                    <button type="button" className="btn btn-info mr-1"
                                                                            title="Block" onClick={ (e) => { this.blockOrUnblock(data.id,data.status) } } >
                                                                        <span className="sr-only">Block</span> <i
                                                                        className="fa fa-lock"></i>
                                                                    </button>
                                                                    :
                                                                    <button type="button" className="btn btn-info mr-1"
                                                                            title="UnBlock" onClick={ (e) => { this.blockOrUnblock(data.id,data.status) } } >
                                                                        <span className="sr-only">UnBlock</span> <i
                                                                        className="fa fa-unlock"></i>
                                                                    </button>
                                                            }
                                                            </>
                                                            :
                                                            <>
                                                                {
                                                                    data.status === "active" ?
                                                                        <button type="button" className="btn btn-info mr-1"
                                                                                title="Block" onClick={ (e) => { this.blockOrUnblock(data.id,data.status) } } >
                                                                            <span className="sr-only">Block</span> <i
                                                                            className="fa fa-lock"></i>
                                                                        </button>
                                                                        :
                                                                        <button type="button" className="btn btn-info mr-1"
                                                                                title="UnBlock" onClick={ (e) => { this.blockOrUnblock(data.id,data.status) } } >
                                                                            <span className="sr-only">UnBlock</span> <i
                                                                            className="fa fa-unlock"></i>
                                                                        </button>
                                                                }
                                                            </>
                                                    }
                                                    <button type="button" className="btn btn-danger mr-1" title="Delete"
                                                            onClick={() => {
                                                                this.deleteUser(data.id)
                                                            }}>
                                                        <span className="sr-only">Delete</span> <i
                                                        className="fa fa-trash-o"></i>
                                                    </button>
                                                </td>
                                        }
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
                                           forcePage={this.state.userResult.page - 1}
                                           pageCount={this.state.userResult.totalPages}
                                           previousLabel="Previous"
                                           renderOnZeroPageCount={null}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserTable;
