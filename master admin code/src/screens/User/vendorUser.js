import React,{Component} from 'react'
import PageHeader from "../../components/PageHeader";
import {getAllVendors, removeVendor } from "../../services/userServices/userService";
import {Link} from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

class VendorUser extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userLists:[],
            userData: {},
        }
    }

    async componentDidMount() {
        await this.loadUsers();
    }

    loadUsers = async (page) => {
        const get = await getAllVendors(page);
        if(get.results){
            this.setState({
                userLists: get.results,
                userData: get,
            });
        }
    }

    removeVendor = async (vendorId) => {

        const data = {
            vendorId,
        }

        Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "Are you sure want to remove this vendor?",
            cancelButtonText: 'No',
            confirmButtonText: 'Yes',
            showCancelButton: true
        }).then(async (res) => {
            if(res.isConfirmed){
                const remove = await removeVendor(data);
                if(remove.status === "success"){
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: "Vendor removed successfully",
                    }).then(async (ok) => {
                       if(ok.isConfirmed){
                           await this.loadUsers();
                       }
                    });
                }else{
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: remove.message
                    });
                }
            }
        });
    }

    handlePageClick = async (e) => {
        let page = e.selected + 1;
        await this.loadUsers(page);
    }

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
                        HeaderText="Vendor Users"
                        Breadcrumb={[
                            { name: "Vendor Users", navigate: "/vendor-users" },
                        ]}
                    />
                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="header">
                                    <h2>
                                        Vendor Table{" "}
                                        <small>
                                            Here is all registered vendors
                                        </small>
                                    </h2>
                                    <div className="row">
                                        <div className="col-md-9"></div>
                                        <div className="col-md-2">
                                            <select className="form-control">
                                                <option value="">Filter By Status</option>
                                                <option value="active">Active</option>
                                                <option value="in_active">In Active</option>
                                            </select>
                                        </div>
                                        <div className="col-md-1">
                                            <Link to={'/add-vendor'}>
                                                <button className="btn btn-info float-right">Add Vendor</button>
                                            </Link>
                                        </div>
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
                                            <th>Phone</th>
                                            <th>Register Date</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.userLists.map((user,index) =>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{ user.first_name }</td>
                                                    <td>{ user.last_name }</td>
                                                    <td>{ user.email }</td>
                                                    <td>{ user.mobile_number }</td>
                                                    <td>{ moment(user.createdAt).format('DD MMM Y') }</td>
                                                    <td>
                                                        <Link to={'edit-vendor/' + user.id}>
                                                            <button className="btn btn-info"><i className="icon-pencil"></i></button>
                                                        </Link>
                                                        &nbsp;
                                                        <button className="btn btn-danger" onClick={ () => { this.removeVendor(user.id) }}><i className="icon-trash"></i></button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </table>
                                    <div className="float-right">
                                        {
                                            this.state.userData.page !== undefined && (
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
                                                               forcePage={this.state.userData?.page - 1}
                                                               pageCount={this.state.userData?.totalPages}
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
            </>
        )
    }

}

export default VendorUser;
