import React from "react";
import swal from "sweetalert2";
import {Link} from "react-router-dom";
import {removeAdminUser} from "../../services/adminUserServices/adminUserService";
import ReactPaginate from "react-paginate";
import Cookies from "universal-cookie";
import * as XLSX from "xlsx";

class AdminUserTable extends React.Component {
    constructor(props) {
        super(props);
        const cookies = new Cookies();

        this.state = {
            users: this.props.users?.results || [],
            userResult: this.props.users || {},
            load: this.props.load || false,
            userDetails: cookies.get('user') ? cookies.get('user') : {},
            permission: cookies.get('user')?.permissions || [],
            startIndex: (this.props.users?.page - 1) * this.props.users?.limit,
        }
    }

    deleteAdmin = async (userId) => {
        swal.fire({
            icon:'warning',
            title: 'Warning!',
            text: 'Are you sure want to remove this admin user?',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes'
        }).then(async (result) => {
           if(result.isConfirmed){

               const data = {
                   userId
               }
               const removeUser = await removeAdminUser(data);
               if(removeUser.status === 'success'){
                   await swal.fire({
                       icon: 'success',
                       title: 'Success!',
                       text: removeUser.message
                   });
                   this.props.loadUser();
               }else{
                   await swal.fire({
                       icon: 'error',
                       title: 'Error!',
                       text: removeUser.message
                   });
               }
           }
        });
    }

    handlePageClick = (e) => {
        let page = e.selected + 1;
        this.props.loadUser(page);
    }

    getModulePermission = (moduleName) => {
        let permission = {};
        let userPermission = this.state.permission;
        permission = userPermission.find((value) => value[moduleName]);
        return permission;
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
            <div className="col-lg-12">
                <div className="card">
                    <div className="header">
                        <h2>
                           Admin Users Table{" "}
                            <small>
                                You can create sub admin from here.
                            </small>
                        </h2>
                        {
                            this.state.userDetails?.role === 'admin_user' ?
                                <>
                                    {
                                        this.getModulePermission('adminUser').adminUser.add && (
                                            <Link to="/add-admin-user">
                                                <button className="btn btn-info float-right">Add Admin User</button>
                                            </Link>
                                        )
                                    }
                                </>
                                :
                                <>
                                    <button className="btn btn-secondary float-right" onClick={() => this.exportTableToExcel('adminUserTable', 'adminUserData')}> Export </button>
                                    <Link to="/add-admin-user">
                                        <button className="btn btn-info float-right mr-4">Add Admin User</button>
                                    </Link>
                                </>

                        }
                    </div>
                    <div className="body table-responsive">
                        <table className="table" id="adminUserTable">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Username</th>
                                {
                                    this.state.userDetails?.role === 'admin_user' ?
                                        <>
                                            {
                                                (this.getModulePermission('adminUser').adminUser.edit ||
                                                this.getModulePermission('adminUser').adminUser.delete) && (
                                                    <th className="text-center">Actions</th>
                                                )
                                            }
                                        </>
                                    :
                                        <th className="text-center">Actions</th>
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.users.map((user, index) =>
                                    <tr key={user.id}>
                                        <td>{ this.state.startIndex + index + 1 }</td>
                                        <td>{ user.first_name }</td>
                                        <td>{ user.last_name }</td>
                                        <td>{ user.email }</td>
                                        <td>{ user.username }</td>
                                        {
                                            this.state.userDetails?.role === 'admin_user' ?
                                                <>
                                                    {
                                                        (this.getModulePermission('adminUser').adminUser.edit ||
                                                            this.getModulePermission('adminUser').adminUser.delete) && (
                                                            <td className="text-center">
                                                                {
                                                                    this.getModulePermission('adminUser').adminUser.edit && (
                                                                        <Link to={'/edit-admin-user/' + user.id }>
                                                                            <button type="button" className="btn btn-info mr-1" title="Edit">
                                                                                <span className="sr-only">Edit</span> <i className="fa fa-pencil"></i>
                                                                            </button>
                                                                        </Link>
                                                                    )
                                                                }
                                                                {
                                                                    this.getModulePermission('adminUser').adminUser.delete && (
                                                                        <button type="button" className="btn btn-danger mr-1" title="Delete" onClick={() => { this.deleteAdmin(user.id) } }>
                                                                            <span className="sr-only">Delete</span> <i className="fa fa-trash-o"></i>
                                                                        </button>
                                                                    )
                                                                }

                                                            </td>
                                                        )
                                                    }
                                                </>
                                                :
                                            <td className="text-center">
                                                <Link to={'/edit-admin-user/' + user.id }>
                                                    <button type="button" className="btn btn-info mr-1" title="Edit">
                                                        <span className="sr-only">Edit</span> <i className="fa fa-pencil"></i>
                                                    </button>
                                                </Link>
                                                <button type="button" className="btn btn-danger mr-1" title="Delete" onClick={() => { this.deleteAdmin(user.id) } }>
                                                    <span className="sr-only">Delete</span> <i className="fa fa-trash-o"></i>
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
                                           onPageChange={ (e) => {this.handlePageClick(e)} }
                                           pageRangeDisplayed={5}
                                           forcePage={this.state.userResult.page - 1}
                                           pageCount={this.state.userResult.totalPages}
                                           previousLabel="Previous"
                                           renderOnZeroPageCount={null}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminUserTable;