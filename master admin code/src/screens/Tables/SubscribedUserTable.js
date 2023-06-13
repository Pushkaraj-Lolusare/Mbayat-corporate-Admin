import React from "react";
import swal from "sweetalert2";
import {Link} from "react-router-dom";
import {deleteUser} from "../../services/userServices/userService";
import ReactPaginate from "react-paginate";
import Cookies from "universal-cookie";
import moment from "moment";

class SubscribedUserTable extends React.Component {

    constructor(props) {
        super(props);
        const cookies = new Cookies();

        this.state = {
            userList: props.userList.results,
            userResult: this.props.userList || {},
            userDetails: cookies.get('user') ? cookies.get('user') : {},
            permission: cookies.get('user')?.permissions || [],
            startIndex: (this.props.userList?.page - 1) * this.props.userList?.limit,
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
        this.props.loadUser(page);
    }

    getModulePermission = (moduleName) => {
        let permission = {};
        let userPermission = this.state.permission;
        permission = userPermission.find((value) => value[moduleName]);
        return permission;
    }

    render() {
        return (
            <div className="col-lg-12">
                <div className="card">
                    <div className="header">
                        <h2>
                            Subscribed User Table{" "}
                            <small>
                                Here is all Subscribed users
                            </small>
                        </h2>
                        <div className='float-right'>
                            <select className='form-control' name={'filter-user'}>
                                <option value={''}>Select User Type</option>
                                <option value={'individual_user'}>Individual User</option>
                                <option value={'corporate_user'}>Corporate User</option>
                                <option value={'vendor_user'}>Vendor User</option>
                            </select>
                        </div>
                    </div>
                    <div className="body table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Phone</th>
                                <th>User Type</th>
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
                                        <th scope="row">{ this.state.startIndex + index + 1}</th>
                                        <td>{data?.first_name}</td>
                                        <td>{data?.last_name}</td>
                                        <td>{data?.email}</td>
                                        <td>{data?.username}</td>
                                        <td>{data?.mobile_number}</td>
                                        <td className="text-capitalize">{
                                            data?.role === "user" ? "Individual" : data?.role
                                        }</td>
                                        <td>{ moment(data?.createdAt).format("Y-MM-DD") }</td>
                                        {
                                            this.state.userDetails?.role === 'admin_user' ?
                                                <>
                                                    {
                                                        (this.getModulePermission('registeredUser').registeredUser.edit ||
                                                            this.getModulePermission('registeredUser').registeredUser.delete) && (
                                                            <td className='text-center'>
                                                                {
                                                                    this.getModulePermission('registeredUser').registeredUser.edit && (
                                                                        <Link to={`edit-user/${data.id}`}>
                                                                            <button type="button" className="btn btn-info mr-1"
                                                                                    title="Delete">
                                                                                <span className="sr-only">Delete</span> <i
                                                                                className="fa fa-pencil"></i>
                                                                            </button>
                                                                        </Link>
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
                                                    <Link to={`edit-user/${data.id}`}>
                                                        <button type="button" className="btn btn-info mr-1"
                                                                title="Delete">
                                                            <span className="sr-only">Delete</span> <i
                                                            className="fa fa-pencil"></i>
                                                        </button>
                                                    </Link>
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

export default SubscribedUserTable;
