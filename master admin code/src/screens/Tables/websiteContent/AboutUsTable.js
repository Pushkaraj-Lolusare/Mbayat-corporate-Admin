import React, {Component} from "react";

class AboutUsTable extends Component{

    constructor(props) {
        super(props);

        this.state = {}

    }

    render() {
        return (
            <>
                <div className="card">
                    <div className="header">
                        <h5>Website Content For About Us Page</h5>
                    </div>
                    <div className="body table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th className="text-center">Title</th>
                                <th>Content</th>
                                <th className="text-center">Created At</th>
                                <th className="text-center">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>#001</td>
                                <td className="text-center">About Us</td>
                                <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat convallis lorem...</td>
                                <td className="text-center">02-02-2023</td>
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

export default AboutUsTable;