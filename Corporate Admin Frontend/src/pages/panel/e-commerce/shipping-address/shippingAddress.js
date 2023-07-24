import React from 'react'
import Head from '../../../../layout/head/Head';
import Content from '../../../../layout/content/Content';
import { BlockBetween, BlockHeadContent, BlockTitle, Icon } from '../../../../components/Component';
import { Button, Col, Form, Modal, ModalBody } from 'reactstrap';
import { BlockHeadShipping } from '../../../../components/block/Block';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export const shippingAddress = () => {
    const [address, setAddress] = useState({
        country: 'Kuwait',
        state: '',
        pincode: '',
        area: '',
        block: '',
        street: '',
        houseNo: '',
        apartment: '',
        floor: '',
        avenue: '',
        direction: '',
    });
    const states = [
        { name: 'Al Asimah', areas: ['Kuwait City', 'Sharq', 'Jaber Al-Ahmad City', 'Mirqab', 'Dasman', 'Salhiya', 'Salmiya', 'Hawally', 'Mishref', 'Bayan',] },
        { name: 'Hawalli', areas: ['Mishref', 'Salmiya', 'Bayan', 'Rumaithiya', 'Salwa', 'Rai'] },
        { name: 'Farwaniya', areas: ['Al Dajeej', 'Abdullah Al-Mubarak Al-Sabah', 'Al-Rai', 'Jleeb Al-Shuyoukh', 'Al-Riggae', 'Khaitan',] },
        { name: 'Ahmadi', areas: ['Fintas', 'Manqaf', 'Wafrah', 'Riqqh',] },
        { name: 'Mubarak Alkabeer', areas: ['Abu Fatira', 'Abu Halifa', 'Al Wafra', 'Bnaider', 'Fahaheel', 'Jaber Al Ahmad', 'Mangaf',] },
        { name: 'Jahra', areas: ['Naseem', 'Al Sulaibikhat', 'Amghara', 'Kabad', 'Jahra Industrial Area', 'Qasr',] },
    ];
    const [modal, setModal] = useState({
        add: false,
        edit: false,
    })
    const [editForm, setEditForm] = useState({
        country: 'Kuwait',
        state: '',
        pincode: '',
        area: '',
        block: '',
        street: '',
        houseNo: '',
        apartment: '',
        floor: '',
        avenue: '',
        direction: '',
    });
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get('http://localhost:5500/corporate-shipping', {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            });
            setAddresses(response.data.reverse());
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleAddressSelection = (address) => {
        setSelectedAddress(address);
        console.log(address);
    };

    const handleEditAddress = (address) => {
        setSelectedAddress(address);
        setEditForm({
            country: 'Kuwait',
            state: address.state,
            pincode: address.pincode,
            area: address.area,
            block: address.block,
            street: address.street,
            houseNo: address.houseNo,
            apartment: address.apartment,
            floor: address.floor,
            avenue: address.avenue,
            direction: address.direction,
        });
        setModal({ edit: true });
    };
    const handleInputChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`http://localhost:5500/corporate-shipping/${selectedAddress._id}`, editForm, {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            });
            fetchAddresses();
            toast.success("Address Updated")
            setModal({ edit: false });
        } catch (error) {
            console.log('Error:', error);
        }
        // console.log(editForm);
    };



    const handleDeleteAddress = async (address) => {
        try {
            await axios.delete(`http://localhost:5500/corporate-shipping/${address._id}`, {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            });
            fetchAddresses();
            toast.success("Address Deleted")
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setAddress({ ...address, state: selectedState });
    };

    const handleAreaChange = (e) => {
        const selectedArea = e.target.value;
        setAddress({ ...address, area: selectedArea });
    };

    useEffect(() => {
        fetchAddresses();
        // console.log(selectedAddress)
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5500/corporate-shipping/`, address, {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            });
            console.log("res", res);
            setAddress({
                country: 'Kuwait',
                state: '',
                pincode: '',
                area: '',
                block: '',
                street: '',
                houseNo: '',
                apartment: '',
                floor: '',
                avenue: '',
                direction: '',
            });

            // Add further handling or redirection logic as needed
            toast.success(res.data.msg)
            setModal({ add: false })
            fetchAddresses()
        } catch (error) {
            console.error(error);
            // Handle error scenario
        }

    };

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleEditToggle = (e) => {
        setModal({ edit: false })
        setSelectedAddress(null)
    }

    return (
        <div>
            <Head title="Shipping Address"></Head>
            {/* <Content>
                <BlockHeadShipping size="sm" >
                    <BlockBetween >
                        <BlockHeadContent>
                            <BlockTitle ><Icon name="truck"></Icon>&nbsp; Shipping Address</BlockTitle>
                        </BlockHeadContent>
                        <BlockHeadContent>
                            <Button
                                className="toggle d-none d-md-inline-flex"
                                color="primary"
                                onClick={() => setModal({ add: true })}
                            >
                                <Icon name="plus"></Icon>
                                <span>Add Address</span>
                            </Button>
                        </BlockHeadContent>
                        <BlockHeadContent>
                            <div className="toggle-wrap nk-block-tools-toggle">
                                <div className="toggle-expand-content" style={{ display: "sm" ? "block" : "none" }}>
                                    <ul className="nk-block-tools g-3">
                                        <li className="nk-block-tools-opt">
                                            <Button
                                                className="toggle d-none d-md-inline-flex"
                                                color="primary"
                                                disabled={selectedAddress===null}
                                                onClick={() => {
                                                    alert("Payment Page loading......")
                                                }}
                                            >
                                                <Icon name="sign-dollar"></Icon>
                                                <span>Move to Payment</span>
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHeadShipping>
            </Content> */}
            {/* <Content>
                <BlockHeadShipping size="sm">
                    <BlockBetween>
                        <BlockHeadContent className="d-flex flex-wrap align-items-center ">
                            <BlockTitle className="me-3 ">
                                <Icon name="truck"></Icon>&nbsp; Shipping Address
                            </BlockTitle>
                            <Button
                                className="toggle d-inline-flex ms-auto"
                                color="primary"
                                onClick={() => setModal({ add: true })}
                            >
                                <Icon name="plus"></Icon>
                                <span className="d-none d-lg-inline">Add Address</span>
                            </Button>
                        </BlockHeadContent>
                        <BlockHeadContent className="toggle-wrap nk-block-tools-toggle ">
                            <div className="toggle-expand-content">
                                <ul className="nk-block-tools g-3">
                                    <li className="nk-block-tools-opt">
                                        <Button
                                            className="toggle d-inline-flex"
                                            color="primary"
                                            disabled={selectedAddress === null}
                                            onClick={() => {
                                                alert("Payment Page loading...");
                                            }}
                                        >
                                            <Icon name="sign-dollar"></Icon>
                                            <span className="d-none d-lg-inline">Move to Payment</span>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHeadShipping>
            </Content> */}
            <Content>
                <BlockHeadShipping size="sm">
                    <BlockBetween>
                        <BlockHeadContent className="d-flex flex-wrap align-items-center" >
                            <BlockTitle className="me-3 col-32 col-sm-17 col-md-25 col-lg-26 ">
                                <Icon name="truck"></Icon>&nbsp; Shipping Address
                            </BlockTitle>

                        </BlockHeadContent>
                        {/* <BlockHeadContent className="toggle-wrap nk-block-tools-toggle">
                            <div className="toggle-expand-content">
                                <ul className="nk-block-tools g-3">
                                    <li className="nk-block-tools-opt">

                                    </li>
                                </ul>
                            </div>
                        </BlockHeadContent> */}
                        <Button
                            className="toggle d-inline-flex ms-auto"
                            color="primary"
                            onClick={() => setModal({ add: true })}
                        >
                            <Icon name="plus"></Icon>
                            <span className="d-none d-sm-inline">Add Address</span>
                        </Button>
                        <Button
                            className="toggle d-inline-flex ms-auto "
                            color="primary"
                            disabled={selectedAddress === null}
                            onClick={() => {
                                alert("Payment Page loading...");
                            }}
                            style={{ marginLeft: '100px' }}
                        >
                            <Icon name="sign-dollar"></Icon>
                            <span className="d-none d-sm-inline">Payment</span>
                        </Button>
                    </BlockBetween>
                </BlockHeadShipping>
            </Content>

            {
                addresses.length > 0 ?
                    <div style={{ marginTop: "-40px" }}>
                        <div className="col-12 col-sm-11 col-md-9 col-lg-12" style={{ maxHeight: "70vh", overflow: 'auto', alignItems: "center", padding: '12px' }}>
                            {addresses.map((address) => (
                                <div key={address._id} className="card mb-3 col-12 col-sm-11 col-md-9 col-lg-6" style={{ height: "8rem", borderRadius: "12px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;" }}>
                                    <div className="card-body " style={{ borderRadius: "12px", width: "100%", display: "flex", height: "100%", gap: "10px", padding: "16px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;" }}>
                                        <div className="form-check" style={{ paddingTop: "34px", paddingLeft: '20px', }}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="selectedAddress"
                                                checked={selectedAddress === address}
                                                onChange={() => handleAddressSelection(address)}
                                                style={{ border: "2px solid gray" }}
                                            />
                                        </div>
                                        <div className="address-details fs-8 fs-sm-1 fs-md-2 fs-lg-8" style={{ width: "90%", fontWeight: "bold", lineHeight: "10px", paddingTop: "10px", paddingLeft: "10px" }}>
                                            <div style={{ display: "flex", flexWrap: 'wrap' }} >
                                                {
                                                    address.houseNo ? <p className="mb-2">{address.houseNo},&nbsp;</p> : " "
                                                }
                                                {
                                                    address.apartment ? <p className="mb-2"> {address.apartment},&nbsp;</p> : " "
                                                }
                                                {
                                                    address.floor ? <p className="mb-2"> {address.floor},&nbsp;</p> : " "
                                                }
                                                <p className="mb-2">{`${address.block} block`},&nbsp;</p>
                                                {
                                                    address.floor ? <p className="mb-2">{address.avenue},&nbsp;</p> : " "
                                                }
                                            </div>
                                            <div style={{ display: "flex", flexWrap: 'wrap' }}>
                                                {
                                                    address.direction ? <p className="mb-2">{address.direction},&nbsp;</p> : " "
                                                }
                                                <p className="mb-2">{address.street},&nbsp;</p>

                                            </div>
                                            <p className="mb-2">{address.area},&nbsp;</p>
                                            <div style={{ display: "flex" }}>
                                                <p className="mb-2">{address.state},&nbsp;</p>
                                                <p className="mb-2">{`    ${address.country} `}&nbsp; </p> -&nbsp;
                                                <p className="mb-2">{address.pincode}.</p>
                                            </div>
                                        </div>
                                        <div style={{ width: "10%", display: 'flex', justifyContent: 'space-between', flexDirection: "column", }}>
                                            <button
                                                className="btn btn-primary me-2"
                                                onClick={() => handleEditAddress(address)}
                                                style={{
                                                    // border:"1px solid red" ,
                                                    color: 'rgb(10,210,210)',
                                                    backgroundColor: "white",
                                                    border: "none",
                                                    // width:"4%"
                                                }}
                                            >
                                                <Icon name="edit" ></Icon>
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteAddress(address)}
                                                style={{
                                                    // border:"1px solid red" ,
                                                    color: 'red',
                                                    backgroundColor: "white",
                                                    border: "none",
                                                    marginTop: "30px",
                                                    // width:"4%"
                                                }}
                                            >
                                                <Icon name="trash"  ></Icon>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div></div> :
                    <div style={{ margin: 'auto', width: '80%', padding: '10px' }}>
                        <Button onClick={() => setModal({ add: true })}>Add shipping address</Button>
                    </div>
            }



            <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
                <ModalBody>
                    <a
                        href="#cancel"
                        onClick={(ev) => {
                            ev.preventDefault();
                            setModal({ add: false });
                        }}
                        className="close"
                    >
                        <Icon name="cross-sm"></Icon>
                    </a>
                    <div className="p-2">
                        <h5 className="title">Add Subscriptions</h5>
                        <div className="mt-4">
                            <Form className="row gy-4" onSubmit={handleSubmit} >
                                <div>
                                    {/* Country */}
                                    <Col md="6" style={{ marginBottom: "10px" }}>
                                        <div className="form-group">
                                            <label className="form-label">Country</label>
                                            <input
                                                type="text"
                                                id="quantity"
                                                name="quantity"
                                                className="form-control"
                                                required
                                                value={address.country}
                                            />
                                        </div>
                                    </Col>
                                    {/* State */}
                                    <Col md="6" style={{ marginBottom: "10px" }}>
                                        <div className="form-group">
                                            <label className="form-label">State</label>
                                            <select required className="form-select" onChange={handleStateChange}>
                                                <option value="">Select your state</option>
                                                {states.map((state) => (
                                                    <option key={state.name} value={state.name}>
                                                        {state.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </Col>
                                    {/* Pincode */}
                                    <Col md="6" style={{ marginBottom: "10px" }}>
                                        <div className="form-group">
                                            <label className="form-label">Pincode</label>
                                            <input
                                                type="number"
                                                id="quantity"
                                                name="pincode"
                                                className="form-control"
                                                required
                                                value={address.pincode}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </Col>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        {/* Area */}
                                        <Col md="6" style={{ marginBottom: "10px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Area</label>
                                                <select required className="form-select" onChange={handleAreaChange}>
                                                    <option value="">Select an area</option>
                                                    {states
                                                        .find((state) => state.name === address.state)
                                                        ?.areas.map((area) => (
                                                            <option key={area} value={area}>
                                                                {area}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </Col>
                                        {/* Block */}
                                        <Col md="6" style={{ marginBottom: "10px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Block</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="block"
                                                    className="form-control"
                                                    required
                                                    value={address.block}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </Col>
                                    </div>

                                    <div style={{ display: "flex", gap: "20px" }}>
                                        {/* Street */}
                                        <Col md="6" style={{ marginBottom: "10px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Street</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="street"
                                                    className="form-control"
                                                    required
                                                    value={address.street}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </Col>
                                        {/* House No. */}
                                        <Col md="6" style={{ marginBottom: "10px" }}>
                                            <div className="form-group">
                                                <label className="form-label">House No.</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="houseNo"
                                                    className="form-control"
                                                    // required
                                                    value={address.houseNo}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </Col>
                                    </div>

                                    <div style={{ display: "flex", gap: "20px" }}>
                                        {/* Apartment */}
                                        <Col md="6" style={{ marginBottom: "12px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Apartment</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="apartment"
                                                    className="form-control"
                                                    value={address.apartment}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </Col>
                                        {/* Floor */}
                                        <Col md="6" style={{ marginBottom: "12px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Floor</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="floor"
                                                    className="form-control"
                                                    value={address.floor}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </Col>
                                    </div>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        {/* Avenue */}
                                        <Col md="6" style={{ marginBottom: "12px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Avenue</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="avenue"
                                                    className="form-control"
                                                    value={address.avenue}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </Col>
                                        {/* Direction */}
                                        <Col md="6" style={{ marginBottom: "12px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Direction</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="direction"
                                                    className="form-control"
                                                    value={address.direction}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </Col>
                                    </div>
                                </div>
                                <Col size="12">
                                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                        <li>
                                            <Button color="primary" size="md" type="submit">
                                                Add
                                            </Button>
                                        </li>
                                        <li>
                                            <Button
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    setModal({ add: false })
                                                }}
                                                className="link link-light"
                                                style={{ padding: '11px' }}
                                            >
                                                Cancel
                                            </Button>
                                        </li>
                                    </ul>
                                </Col>
                            </Form>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <Modal isOpen={modal.edit} toggle={handleEditToggle} className="modal-dialog-centered" size="lg">
                <ModalBody>
                    <a
                        href="#cancel"
                        onClick={(ev) => {
                            ev.preventDefault();
                            setModal({ add: false });
                        }}
                        className="close"
                    >
                        <Icon name="cross-sm"></Icon>
                    </a>
                    <div className="p-2">
                        <h5 className="title">Add Subscriptions</h5>
                        <div className="mt-4">
                            <Form className="row gy-4" onSubmit={handleEditFormSubmit} >
                                <div>
                                    {/* Country */}
                                    <Col md="6" style={{ marginBottom: "10px" }}>
                                        <div className="form-group">
                                            <label className="form-label">Country</label>
                                            <input
                                                type="text"
                                                id="quantity"
                                                name="quantity"
                                                className="form-control"
                                                required
                                                value={editForm.country}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </Col>
                                    {/* State */}
                                    <Col md="6" style={{ marginBottom: "10px" }}>
                                        <div className="form-group">
                                            <label className="form-label">State</label>
                                            <select required className="form-select" value={editForm.state} onChange={(event) => {
                                                const selectedState = states.find(
                                                    (state) => state.name === event.target.value
                                                );
                                                setEditForm((prevState) => ({
                                                    ...prevState,
                                                    state: event.target.value,
                                                    area: selectedState ? selectedState.areas[0] : "",
                                                }));
                                            }}>
                                                <option value="">Select your state</option>
                                                {states.map((state) => (
                                                    <option key={state.name} value={state.name}>
                                                        {state.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </Col>
                                    {/* Pincode */}
                                    <Col md="6" style={{ marginBottom: "10px" }}>
                                        <div className="form-group">
                                            <label className="form-label">Pincode</label>
                                            <input
                                                type="number"
                                                id="quantity"
                                                name="pincode"
                                                className="form-control"
                                                required
                                                value={editForm.pincode}
                                                onChange={handleInputChange} />
                                        </div>
                                    </Col>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        {/* Area */}
                                        <Col md="6" style={{ marginBottom: "10px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Area</label>
                                                <select required className="form-select" value={editForm.area} onChange={(event) => {
                                                    setEditForm((prevState) => ({
                                                        ...prevState,
                                                        area: event.target.value,
                                                    }));
                                                }}>
                                                    <option value="">Select an area</option>
                                                    {states.map((state) => {
                                                        if (state.name === editForm.state) {
                                                            return state.areas.map((area) => (
                                                                <option key={area} value={area}>
                                                                    {area}
                                                                </option>
                                                            ));
                                                        }
                                                        return null;
                                                    })}
                                                </select>
                                            </div>
                                        </Col>
                                        {/* Block */}
                                        <Col md="6" style={{ marginBottom: "10px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Block</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="block"
                                                    className="form-control"
                                                    required
                                                    value={editForm.block}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </Col>
                                    </div>

                                    <div style={{ display: "flex", gap: "20px" }}>
                                        {/* Street */}
                                        <Col md="6" style={{ marginBottom: "10px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Street</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="street"
                                                    className="form-control"
                                                    required
                                                    value={editForm.street}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </Col>
                                        {/* House No. */}
                                        <Col md="6" style={{ marginBottom: "10px" }}>
                                            <div className="form-group">
                                                <label className="form-label">House No.</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="houseNo"
                                                    className="form-control"
                                                    // required
                                                    value={editForm.houseNo}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </Col>
                                    </div>

                                    <div style={{ display: "flex", gap: "20px" }}>
                                        {/* Apartment */}
                                        <Col md="6" style={{ marginBottom: "12px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Apartment</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="apartment"
                                                    className="form-control"
                                                    value={editForm.apartment}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </Col>
                                        {/* Floor */}
                                        <Col md="6" style={{ marginBottom: "12px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Floor</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="floor"
                                                    className="form-control"
                                                    value={editForm.floor}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </Col>
                                    </div>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        {/* Avenue */}
                                        <Col md="6" style={{ marginBottom: "12px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Avenue</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="avenue"
                                                    className="form-control"
                                                    value={editForm.avenue}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </Col>
                                        {/* Direction */}
                                        <Col md="6" style={{ marginBottom: "12px" }}>
                                            <div className="form-group">
                                                <label className="form-label">Direction</label>
                                                <input
                                                    type="text"
                                                    id="quantity"
                                                    name="direction"
                                                    className="form-control"
                                                    value={editForm.direction}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </Col>
                                    </div>
                                </div>
                                <Col size="12">
                                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                        <li>
                                            <Button color="primary" size="md" type="submit">
                                                Update
                                            </Button>
                                        </li>
                                        <li>
                                            <Button
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    setModal({ edit: false })
                                                }}
                                                className="link link-light"
                                                // size="md"
                                                style={{ padding: '11px' }}
                                            >
                                                Cancel
                                            </Button>
                                        </li>
                                    </ul>
                                </Col>
                            </Form>
                        </div>
                    </div>
                </ModalBody>
            </Modal>



        </div>
    )
}
