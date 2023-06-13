import React, {Component} from "react";

class FaqTable extends Component{

    constructor(props) {
        super(props);

        this.state = {}

    }

    render() {
        return (
            <>
                <div className="card">
                    <div className="header">
                        <h5>Website Content For FAQ's Page</h5>
                    </div>
                    <div className="body table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Question</th>
                                <th>Answer</th>
                                <th className="text-center">Created At</th>
                                <th className="text-center">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>#001</td>
                                <td>Lorem ipsum</td>
                                <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat convallis lorem...</td>
                                <td className="text-center">02-02-2023</td>
                                <td className="text-center">
                                    <span className="badge badge-pill badge-success">Active</span>
                                </td>
                            </tr>
                            <tr>
                                <td>#002</td>
                                <td>Lorem ipsum</td>
                                <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat convallis lorem...</td>
                                <td className="text-center">01-30-2023</td>
                                <td className="text-center">
                                    <span className="badge badge-pill badge-danger">InActive</span>
                                </td>
                            </tr>
                            <tr>
                                <td>#003</td>
                                <td>Lorem ipsum</td>
                                <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat convallis lorem...</td>
                                <td className="text-center">02-01-2023</td>
                                <td className="text-center">
                                    <span className="badge badge-pill badge-success">Active</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }

}

export default FaqTable;