import React, { useState } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import DataCard from "../components/partials/default/DataCard";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown, DropdownItem, Container } from "reactstrap";
import { projectData } from "./pre-built/projects/ProjectData";
import { FaCaretDown } from "react-icons/fa";
import { useHistory } from 'react-router-dom';
import {
  Block,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  Row,
  Col,
  BlockBetween,
} from "../components/Component";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [sm, updateSm] = useState(false);
  const [list, setLists] = useState([])
  console.log(list);
  const fetchVendorData = async () => {
    try {
      const response = await fetch('https://15.185.57.60/api/v1/interest/interest-lists?fetchType=all');
      const jsonData = await response.json();
      setLists(jsonData.results)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    console.log(value);
  };

  const [data, setData] = useState(projectData)

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    console.log("option", option.name)
    setSelectedOption(option);
  };

  const [vendors, setVendors] = useState([]);
  console.log("vendors", vendors);

  const fetchVendorsData = () => {
    const accessToken = localStorage.getItem('accessToken');
    fetch('https://15.185.57.60/api/v1/vendor-home/get-all-vendors?role=vendor&status=active')
      .then(response => response.json())
      .then(data => {
        setVendors(data.results)
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchVendorsData();
  }, []);

  const handleVisitStore = (vendorId) => {
    localStorage.setItem("vendorId", vendorId)
  };

  const filteredVendors = vendors.filter((vendor) => {
    if (!selectedOption || selectedOption.name === "ALL") {
      return true;
    }

    return vendor.interests.includes(selectedOption.id);
  });

  return (
    <React.Fragment>
      <Head title="Homepage"></Head>
      <Content>
        <div size="sm" style={{
          height: "70px",
          borderRadius: "6px",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          top: "64px",
          backgroundColor: "white",
          alignItems: "center",
          paddingLeft: '30px'
        }}>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Dashboard
              </BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="more-v" />
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">


                    <li className="nk-block-tools-opt">

                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </div>
        <Block>
          <Row className="g-gs" >
            {/* <Col xxl="3" sm="6"   >
              <DataCard

                title="Mystery Box Order"
                // percentChange={"4.63"}
                up={true}
                // chart={<DefaultOrderChart />}
                amount={"1975"}
              />
            </Col> */}
            <Col xxl="3" sm="6" >
              <DataCard
                route="subscriptions"
                title="Subscriptions"
                // percentChange={"2.63"}
                up={false}
                // chart={<DefaultRevenueChart />}
                amount={`${2284} KWD`}
              />
            </Col>
            <Col xxl="3" sm="6">
              <DataCard
                title="Orders"
                route="order-list-default"
                // percentChange={"4.63"}
                up={true}
                // chart={<DefaultCustomerChart />}
                amount={"847"}
              />
            </Col>

          </Row>

          <div style={{ border: '0.5px solid rgb(199,205,215)', marginTop: "30px", marginBottom: '30px' }}></div>

          {/* filter by intrests */}

          <div
            style={{
              marginLeft: "-30px",
              width: 'calc(100% + 60px)',
              height: "90px",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between",
              position: 'sticky',
              top: "64px",
              backgroundColor: "white",
              alignItems: "center",
              zIndex: "2",
              paddingRight: "150px",
              paddingLeft: '30px'
            }}>
            <BlockTitle page tag="h3" style={{ marginLeft: "-200px", border: '1px solid red' }}>
              Vendors
            </BlockTitle>
            <div style={{ width: "12%", marginLeft: "-180px" }}>
              <p style={{ width: "100px" }}>Filter By</p>
              <Container style={{ paddingLeft: "0px", marginTop: "-15px", width: "100%" }}>
                <UncontrolledDropdown style={{ width: "140px" }}>
                  <DropdownToggle caret style={{ width: "140px", display: 'flex', justifyContent: "space-between" }} >
                    {selectedOption ? selectedOption.name : "Interest"}<FaCaretDown />
                  </DropdownToggle>

                  <DropdownMenu style={{ width: "140px", maxHeight: "200px", overflow: "auto" }}>
                    <DropdownItem onClick={() => handleOptionSelect({ name: "ALL" })}>ALL</DropdownItem>
                    {list.map((item, index) => (
                      <DropdownItem onClick={() => handleOptionSelect(item)} key={index}>
                        {item.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Container>
            </div>
          </div>
          <Container fluid='true' className="mt-4">
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
              {filteredVendors &&
                filteredVendors.map((item, index) => (
                  <Col key={index} >
                    <div
                      className="p-3 bg-white rounded shadow-sm d-flex flex-column justify-content-between h-100"
                      style={{
                        margin: 'auto',
                        paddingBottom: '10px',
                        textAlign: 'center',
                        padding: '15px 10px',
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                        borderRadius: '10px',
                        backgroundColor: 'rgb(255, 255, 255)',
                        minHeight: '230px'
                      }}
                    >

                      <div className="text-center">
                        <img src="App_Icon.png" fluid="true" className="mb-3" style={{ maxHeight: '100px' }} alt="App Icon" />
                        <p
                          style={{
                            fontWeight: 'bold',
                            marginTop: '12px',
                            maxHeight: '24%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          className="mb-2 text-center">{` ${item.first_name} ${item.last_name}`}</p>

                      </div>
                      <Link to="/ecommerce/products">
                        <Button
                          variant="primary"
                          className="w-75 align-self-center"
                          style={{
                            border: '1px solid black',
                            width: '90%',
                            backgroundColor: 'rgb(73, 197, 182)',
                            margin: 'auto',
                            display: 'block',
                            height: '40px',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            border: 'none',
                            outline: 'none',
                            marginTop: '40px',
                            color: 'rgb(64, 15, 59)',
                            zIndex: "1",

                          }}
                          onClick={() => handleVisitStore(item.id)}
                        >
                          Visit store
                        </Button></Link>
                    </div>
                  </Col>
                ))}
            </Row>
          </Container>
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default Homepage;
