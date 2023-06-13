import React, {Component} from 'react'
import {Button, Modal, Toast} from "react-bootstrap";
import {addInterest, interestLists, removeInterest} from "../../services/InterestServices/interestService";

class TransferInterest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            interestId: "",
            newInterestId: "",
            interestLists: [],
            show: this.props.show ?? true,
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            show: nextProps.show,
            interestId: nextProps.selectedInterestId,
        });
    }

    async componentDidMount() {
        await this.loadInterest();
    }

    loadInterest = async () => {
        const getInterest = await interestLists(1,10,"all");
        if(getInterest.results !== undefined){
            this.setState({
                interestLists: getInterest.results,
            });
        }
    }

    onInterestChange = (e) => {
        let intetestId = e.target.value;
        this.setState({
            newInterestId: intetestId,
        });
    }

    confirmDeleteInterest = async () => {
        const data = {
            interestId: this.state.interestId,
            newInterestId: this.state.newInterestId,
        }
        const remove = await removeInterest(data);
        if (remove.status === "success") {
            this.props.loadInterest();
        } else {
            this.setState({
                errorMessage: remove.message,
                isToastMessage: true
            })
        }
    }

    onClose = () => {
        this.setState({
            show: !this.state.show,
        });
    }

    render() {

        return (
            <>
                <Modal size="md" show={this.state.show} onHide={ () => { this.onClose() } }>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Interest From Transfer</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <select className="form-control" onChange={ (e) => { this.onInterestChange(e) } } >
                            <option value="">Select Interest</option>
                            {
                                this.state.interestLists.map((interest) =>
                                    <option value={interest.id} >{interest.name}</option>
                                )
                            }
                        </select>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { this.onClose() }}>
                            Close
                        </Button>
                        <Button variant="info" onClick={() => {
                                this.confirmDeleteInterest()
                            }}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default TransferInterest;