import React,{Component} from "react";


class Loading extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isLoad: this.props.load || false
        }
    }

    render() {
        return (
            <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
            <div className="loader">
                <div className="m-t-30"><img src={require('../assets/images/logo-icon.svg')} width="48" height="48" alt="Lucid" /></div>
                <p>Please wait...</p>
            </div>
        </div>
        )
    }
}

export default Loading;