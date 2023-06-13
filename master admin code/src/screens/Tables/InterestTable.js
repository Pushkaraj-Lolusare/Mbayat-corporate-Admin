import React, {Component} from "react";
import {Link} from "react-router-dom";
import AddInterest from "../Interest/AddInterest";
import {removeInterest} from "../../services/InterestServices/interestService";
import {Toast} from "react-bootstrap";
import swal from 'sweetalert2'
import EditInterest from "../Interest/EdtiInterest";
import ReactPaginate from "react-paginate";
import Cookies from "universal-cookie";
import AddSubInterest from "../Interest/AddSubInterst";
import TransferInterest from "../Interest/TransferInterest";
import {DownloadTableExcel} from "react-export-table-to-excel";
import * as XLSX from 'xlsx';

class InterestTable extends Component {
    constructor(props) {
        super(props);
        const cookies = new Cookies();
        this.state = {
            show: false,
            editShow: false,
            interestLists: this.props.interestLists.results || [],
            interestResult: this.props.interestLists || {},
            isToastMessage: false,
            errorMessage: "",
            editInterestValue: "",
            editInterestId: "",
            userDetails: cookies.get('user') ? cookies.get('user') : {},
            permission: cookies.get('user')?.permissions || [],
            startIndex: (this.props.interestLists?.page - 1) * this.props.interestLists?.limit,
            subModalShow: false,
            interestId: "",
            openConfirmDelete: false,
            selectedInterestId: "",
        }

        this.tableRef = React.createRef();
    }

    onClose = () => {
        this.setState({
            show: !this.state.show
        });
    }

    onSubClose = () => {
        this.setState({
            subModalShow: !this.state.subModalShow
        });
    }

    onEditClose = () => {
        this.setState({
            editShow: !this.state.editShow
        });
    }

    onEditSave = () => {
        this.setState({
            editShow: !this.state.editShow
        });
        this.props.loadInterest();
    }

    onSave = () => {
        this.setState({
            show: !this.state.show
        });
        this.props.loadInterest();
    }

    deleteInterest = async (interestId) => {

        swal.fire({
            icon: "warning",
            title: "Warning!",
            text: "Are you sure? If you delete this interest then it will remove from all user.",
            showCancelButton: true,
            cancelButtonText: "No",
            confirmButtonText: "Yes"
        }).then(async (ok) => {
            if (ok.isConfirmed) {

                this.setState({
                    openConfirmDelete: true,
                    selectedInterestId: interestId,
                });

                // const data = {
                //     interestId: interestId
                // }
                // const remove = await removeInterest(data);
                // if (remove.status === "success") {
                //     this.props.loadInterest();
                // } else {
                //     this.setState({
                //         errorMessage: remove.message,
                //         isToastMessage: true
                //     })
                // }
            }
        });
    }

    tostMessageLoad = () => {
        this.setState({
            isToastMessage: !this.state.isToastMessage
        });
    }

    handlePageClick = (e) => {
        let page = e.selected + 1;
        this.props.loadInterest(page);
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
                <TransferInterest
                    show={this.state.openConfirmDelete}
                    selectedInterestId={this.state.selectedInterestId}
                    loadInterest={ () => { this.props.loadInterest() } }
                />
                <Toast
                    id="toast-container"
                    show={this.state.isToastMessage}
                    onClose={() => {
                        this.tostMessageLoad();
                    }}
                    className="toast-error toast-top-right"
                    autohide={true}
                    delay={5000}
                >
                    <Toast.Header className="toast-error mb-0">
                        {this.state.errorMessage}
                    </Toast.Header>
                </Toast>
                <div className="card">
                    <div className="header">
                        <h2>
                            Interest Table{" "}
                            <small>
                                From Here you can add edit or remove interest.
                            </small>
                        </h2>
                        <div className="row">
                            <div className="col-md-8"></div>
                            <div className="col-md-4">
                                <button className="btn btn-secondary float-right" onClick={() => this.exportTableToExcel('interestTableId', 'InterestData')}> Export </button>
                                {
                                    this.state.userDetails?.role === 'admin_user' ?
                                        <>
                                            {
                                                this.getModulePermission('interest').interest.add && (
                                                    <button className="btn btn-info float-right mr-4" onClick={() => {
                                                        this.setState({show: true})
                                                    }}>Add Interest
                                                    </button>
                                                )
                                            }
                                        </>
                                        :
                                        <button className="btn btn-info float-right mr-4" onClick={() => {
                                            this.setState({show: true})
                                        }}>Add Interest
                                        </button>
                                }
                            </div>

                        </div>

                    </div>
                    <div className="body table-responsive">
                        <table className="table" id="interestTableId" ref={this.tableRef}>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Total User In Interest</th>
                                <th>Total Vendor In Interest</th>
                                <th>Total Sub Interest</th>
                                {
                                    this.state.userDetails?.role === 'admin_user' ?
                                        <>
                                            {
                                                this.getModulePermission('interest').interest.edit ||
                                                this.getModulePermission('interest').interest.delete ?
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
                                this.state.interestLists.map((data, index) =>
                                    <tr key={data.id}>
                                        <th scope="row">{this.state.startIndex + index + 1}</th>
                                        <td>{data?.name}</td>
                                        <td>
                                            <Link to={'/user-in-interest/' + data.id}>
                                                <button className={'btn btn-info'} disabled={data?.totalUser === 0}>{data?.totalUser}</button>
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={'/user-in-interest/' + data.id + '/vendor'}>
                                                <button className={'btn btn-info'} disabled={data?.totalVendor === 0}>{data?.totalVendor}</button>
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={'/sub-interest/' + data.id}>
                                                <button className={'btn btn-info'} disabled={data?.totalSubInterest === 0}>{data?.totalSubInterest}</button>
                                            </Link>
                                        </td>

                                            {
                                                this.state.userDetails?.role === 'admin_user' ?
                                                    <>
                                                        {
                                                            (this.getModulePermission('interest').interest.edit ||
                                                                this.getModulePermission('interest').interest.delete) && (
                                                                <td className="text-center">
                                                                    {
                                                                        this.getModulePermission('interest').interest.edit && (
                                                                            <button type="button" className="btn btn-info mr-1"
                                                                                    title="Edit" onClick={() => {
                                                                                this.setState({
                                                                                    editInterestValue: data?.name,
                                                                                    editInterestId: data?.id
                                                                                });
                                                                                setTimeout(() => {
                                                                                    this.onEditClose();
                                                                                }, 10)
                                                                            }}>
                                                                                <span className="sr-only">Edit</span> <i
                                                                                className="fa fa-pencil"></i>
                                                                            </button>
                                                                        )
                                                                    }
                                                                    {
                                                                        this.getModulePermission('interest').interest.delete && (
                                                                            <button type="button"
                                                                                    className="btn btn-danger mr-1"
                                                                                    title="Delete" onClick={() => {
                                                                                this.deleteInterest(data.id)
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
                                                        <button type="button" className="btn btn-default mr-1" title="Add Sub Category" onClick={ () => { this.setState({interestId: data.id}); this.onSubClose() } }>
                                                            <i className="fa fa-plus"></i>
                                                        </button>
                                                        <button type="button" className="btn btn-info mr-1" title="Edit"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        editInterestValue: data?.name,
                                                                        editInterestId: data?.id
                                                                    });
                                                                    setTimeout(() => {
                                                                        this.onEditClose();
                                                                    }, 10)
                                                                }}>
                                                            <span className="sr-only">Edit</span> <i
                                                            className="fa fa-pencil"></i>
                                                        </button>
                                                        <button type="button" className="btn btn-danger mr-1"
                                                                title="Delete" onClick={() => {
                                                            this.deleteInterest(data.id)
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
                                           forcePage={this.state.interestResult.page - 1}
                                           pageCount={this.state.interestResult.totalPages}
                                           previousLabel="Previous"
                                           renderOnZeroPageCount={null}/>
                        </div>
                    </div>
                </div>
                <AddInterest
                    show={this.state.show}
                    onClose={() => {
                        this.onClose()
                    }}
                    title="Add Interest"
                    onSave={() => {
                        this.onSave();
                    }}
                />
                <AddSubInterest
                    show={this.state.subModalShow}
                    title="Add Sub Interest"
                    interestId={this.state.interestId}
                    onClose={() => {
                        this.onSubClose()
                    }}
                    onSave={() => {
                        this.onSave();
                    }}
                />
                {
                    this.state.editShow && (
                        <EditInterest
                            show={this.state.editShow}
                            title="Edit Interest"
                            interestValue={this.state.editInterestValue}
                            interestId={this.state.editInterestId}
                            onClose={() => {
                                this.onEditClose()
                            }}
                            onSave={() => {
                                this.onEditSave();
                            }}
                        />
                    )
                }
            </div>
        )
    }
}

export default InterestTable;