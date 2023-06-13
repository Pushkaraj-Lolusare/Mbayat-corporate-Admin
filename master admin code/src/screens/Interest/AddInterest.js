import React, {Component} from 'react'
import {Button, Modal, Toast} from "react-bootstrap";
import {addInterest} from "../../services/InterestServices/interestService";

class AddInterest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            interestName: "",
            isToastMessage: false,
            errorMessage: ""
        }
    }

    saveInterest = async () => {
        const data = {
            name: this.state.interestName
        }
        const save = await addInterest(data);
        if (save.status === "success") {
            this.props.onSave();
        } else {
            this.setState({
                isToastMessage: true,
                errorMessage: save.message
            })
        }
    }

    tostMessageLoad = () => {
        this.setState({
            isToastMessage: !this.state.isToastMessage
        })
    }

    render() {
        const {title, onClose, onSave, size, show} = this.props;
        return (
            <>
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
                <Modal size={size} show={show} onHide={onClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <input type="text" className="form-control" placeholder="Interest Name" onChange={(e) => {
                            this.setState({
                                interestName: e.target.value
                            })
                        }} maxLength={55}/>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="info" onClick={() => {
                            this.saveInterest()
                        }} disabled={!this.state.interestName}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default AddInterest;