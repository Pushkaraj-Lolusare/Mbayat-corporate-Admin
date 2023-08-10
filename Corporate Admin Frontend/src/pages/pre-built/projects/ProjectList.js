import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { saveAs } from 'file-saver'; // Library for downloading files
import * as XLSX from 'xlsx';
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  ModalBody,
  Modal,
  DropdownItem,
  Form,
  Table
} from "reactstrap";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  Col,
  PaginationComponent,
  PreviewAltCard,
  DataTableHead,
  DataTableRow,
  DataTableItem,
} from "../../../components/Component";
import { projectData, teamList } from "./ProjectData";
import { setDeadlineDays } from "../../../utils/Utils";
import { useForm } from "react-hook-form";
import {  toast } from 'react-toastify';

export const ProjectListPage = () => {
  const [sm, updateSm] = useState(false);
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [data, setData] = useState(projectData);
  const [formData, setFormData] = useState({
    tasks: 0,
    team: [],
    totalTask: null,
    purchasedDate: new Date(),
    endDate: new Date()
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);

  const [subscriptionData, setsubscriptionData] = useState([])

  const [itemList, setItemList] = useState([])
  const [subscriptionPlan1, setSubscriptionPlan] = useState('')

  const token = localStorage.getItem("accessToken")
  const userId = localStorage.getItem("userId")

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/corporateSubscription`, {
        method: 'GET',
        headers: {
          "Authorization": token
        },
      });
      if (response) {
        const jsonData = await response.json();
        setsubscriptionData(jsonData);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      lead: "",
      tasks: 0,
      totalTask: 0,
      team: [],
      date: new Date(),
    });
  };

  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  const onFormSubmit = (sData) => {
    const { title, subtitle, description, tasks, totalTask } = sData;
    let submittedData = {
      id: data.length + 1,
      avatarClass: "pink",
      title: title,
      subtitle: subtitle,
      desc: description,
      lead: formData.lead,
      team: formData.team,
      tasks: tasks,
      totalTask: totalTask,
      deadline: new Date(`${formData.date}`), // Format ** mm/dd/yyyy
    };
    setData((data) => [submittedData, ...data]);
    resetForm();
    setModal({ add: false });
  };

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  let currentItems = [];

  if (Array.isArray(subscriptionData)) {
    currentItems = subscriptionData.slice(indexOfFirstItem, indexOfLastItem);
  }

  if (Array.isArray(subscriptionData)) {
    currentItems = subscriptionData.slice(indexOfFirstItem, indexOfLastItem);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit } = useForm();

  const handleCloseModal = () => {
    setModal({ edit: false });
    setItemList([])
    setSubscriptionPlan('')
  };

  const handleViewPromoCodes = (promoCodes, plan) => {
    setSubscriptionPlan(plan)
    setItemList(promoCodes);
    setModal({ edit: true });
  };

  const handleDownload = () => {
    const headers = ['Promo Codes', "Plan", "Status", "Name", "Email"];
    const data = [headers, ...itemList.map((item) => [item.code, subscriptionPlan1, item.status, item.name, item.email])];

    const sheetName = 'Item List';
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(fileData, 'Promocodes.xlsx');
  };

  const [subscriptionPlan, setPostSubscriptionPlan] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [subscriptionDate, setSubscriptionDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState('');

  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setSubscriptionDate(currentDate);
    fetchSubscriptionData();
  }, []);

  const handleSubscriptionPlanPriceChange = (event) => {
    const selectedPlan = event.target.value;
    setPostSubscriptionPlan(selectedPlan);

    const price = calculatePrice(selectedPlan);
    const calculatedTotalAmount = price * quantity;
    setTotalAmount(calculatedTotalAmount);
  };

  const handleQuantityPriceChange = (event) => {
    const selectedQuantity = event.target.value;
    setQuantity(selectedQuantity);

    const price = calculatePrice(subscriptionPlan);
    const calculatedTotalAmount = price * selectedQuantity;
    setTotalAmount(calculatedTotalAmount);
  };

  const calculatePrice = (selectedPlan) => {
    switch (selectedPlan) {
      case '1 month':
        return 15;
      case '3 months':
        return 35;
      case '6 months':
        return 75;
      default:
        return 0;
    }
  };

  const handlePurchase = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/corporateSubscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": token
        },
        body: JSON.stringify({
          subscriptionPlan,
          quantity,
          subscriptionDate,
          totalAmount,
          userId,
        }),
      });

      // console.log(response)
      if (response.ok) {
        const res = await response.json()
        console.log("res", res)

        // const userID=localStorage.getItem("userId")  
        // const paymentResponse = await fetch('http://localhost:5500/paymentgateway', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     "Authorization":"Y2ZmNWM5OTIxYjhiOTY3OWI1OGNhNGE4OTY3MjE2ZTQyNTYyYjY2ZQ=="
        //   },
        //   body: JSON.stringify({
        //     trackid: new Date().getTime(),
        //     amount: quantity,
        //     currency: totalAmount,
        //     payment_type: 1,
        //     success_url: `http://15.185.57.60:3000/v1/payment/paymentSuccess?userId=${userID}&amount=${totalAmount}`,
        //     error_url: `http://15.185.57.60:3000/v1/payment/paymentError?userId=${userID}&amount=${totalAmount}`,
        //     language: 'ENG',
        //   }),
        // });

        // const payres =  JSON.parse(paymentResponse)
        // console.log("payres",payres)

        // if (payres.status) {
        //   if (payres.status === true) {
        //     const paymentData = payres.data;
        //     const { PaymentUrl, PaymentID } = paymentData;
        //     const paymentUrl = `${PaymentUrl}?PaymentID=${PaymentID}`;

        //     setPaymentUrl(paymentUrl);
        //     const paymentWindow = window.open(paymentUrl, '_blank');
        //     window.addEventListener('message', (event) => {
        //       if (event.origin === 'https://development.payzah.net') {
        //         const { status } = event.data;
        //         if (status === true) {
        //           paymentWindow.close();
        //           // Make a post request for subscription only if payment is successful
        //           fetch('http://localhost:5500/subscriptions', {
        //             method: 'POST',
        //             headers: {
        //               'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({
        //               subscriptionPlan,
        //               quantity,
        //               totalAmount,
        //             }),
        //           })
        //             .then((response) => {
        //               if (response.ok) {
        //                 return response.json();
        //               } else {
        //                 throw new Error('Subscription creation failed');
        //               }
        //             })
        //             .then((data) => {
        //               console.log('Subscription created:', data);
        //               // Perform any necessary actions after successful subscription
        //               // e.g., show success message, update UI, etc.
        //             })
        //             .catch((error) => {
        //               console.error('Subscription creation failed:', error);
        //               // Handle error condition
        //             });
        //         } else {
        //           // Handle payment failure condition
        //           console.error('Payment failed:', event.data);
        //         }
        //       }
        //     });
        //   } else {
        //     console.error('Payment failed:', payres.message);
        //   }
        // } else {
        //   console.error('Failed to fetch payment gateway URL');
        // }

        fetchSubscriptionData();
        
        toast.success('Subscription purchased successfully!');
      } else {
        console.error('Error:', response.status);
        toast.error('Failed to purchase subscription. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  //   const handlePurchase = async () => {
  //   try {
  //     const userID = localStorage.getItem("userId");
  //     const paymentResponse = await fetch('https://development.payzah.net/ws/paymentgateway/index', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         "Authorization": "Y2ZmNWM5OTIxYjhiOTY3OWI1OGNhNGE4OTY3MjE2ZTQyNTYyYjY2ZQ=="
  //       },
  //       body: JSON.stringify({
  //         trackid: new Date().getTime(),
  //         amount: totalAmount,
  //         currency: 414,
  //         payment_type: 1,
  //         success_url: `http://localhost:3000/v1/payment/paymentSuccess?userId=${userID}&amount=${totalAmount}`,
  //         error_url: `http://localhost:3000/v1/payment/paymentError?userId=${userID}&amount=${totalAmount}`,
  //         language: 'ENG',
  //       }),
  //     });

  //     const payres = await paymentResponse.json();
  //     console.log("payres", payres);

  //     if (paymentResponse.ok) {
  //       const payres = await paymentResponse.json();
  //       console.log("payres2", payres);
  //       const paymentData = payres.data;
  //       const { PaymentUrl, PaymentID } = paymentData;
  //       const paymentUrl = `${PaymentUrl}?PaymentID=${PaymentID}`;

  //       setPaymentUrl(paymentUrl);
  //       const paymentWindow = window.open(paymentUrl, '_blank');
  //       window.addEventListener('message', (event) => {
  //         if (event.origin === 'https://development.payzah.net') {
  //           const { status } = event.data;
  //           if (status === true) {
  //             paymentWindow.close();
  //             fetch('http://localhost:5500/subscriptions', {
  //               method: 'POST',
  //               headers: {
  //                 'Content-Type': 'application/json',
  //               },
  //               body: JSON.stringify({
  //                 subscriptionPlan,
  //                 quantity,
  //                 subscriptionDate,
  //                 totalAmount,
  //               }),
  //             })
  //               .then((response) => {
  //                 if (response.ok) {
  //                   return response.json();
  //                 } else {
  //                   throw new Error('Subscription creation failed');
  //                 }
  //               })
  //               .then((data) => {
  //                 console.log('Subscription created:', data);
  //                 toast.success('Subscription purchased successfully!');
  //               })
  //               .catch((error) => {
  //                 console.error('Subscription creation failed:', error)
  //                 toast.error( 'Failed to purchase subscription. Please try again.');
  //               });
  //           } else {
  //             console.error('Payment failed:', event.data);
  //             toast.error('An error occurred. Please try again later.');
  //           }
  //         }
  //       });
  //     } else {
  //       console.error('Payment failed:', payres.message);
  //       toast.error('Failed to fetch payment gateway URL');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     toast.error('An error occurred. Please try again later.');
  //   }
  // };


  // const showAlert = (title, message, type) => {
  //   const alertContainer = document.getElementById('alertContainer');
  //   const alertHTML = `
  //     <div class="alert alert-${type} alert-dismissible fade show" role="alert">
  //       <strong>${title}</strong> ${message}
  //       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  //     </div>
  //   `;
  //   alertContainer.innerHTML = alertHTML;

  //   setTimeout(() => {
  //     const alertElement = alertContainer.querySelector('.alert');
  //     alertElement.remove();
  //   }, 3000);
  // };

  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanChange = (planName) => {
    setSelectedPlan(planName);
  };

  const filteredItems = currentItems.filter((item) => {
    if (!selectedPlan) {
      return true;
    }
    return item.subscriptionPlan === selectedPlan;
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    
    const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    
    return formattedDate;
  }
  console.log("curr", currentItems)
  return (
    <React.Fragment>
      <Head title="Project List"></Head>
      <Content>
        
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Subscriptions</BlockTitle>
              {/* <BlockDes className="text-soft">You have total {data.length} projects</BlockDes> */}
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                          <Icon name="filter-alt" className="d-none d-sm-inline"></Icon>
                          <span>Filtered By Plan</span>
                          <Icon name="chevron-right" className="dd-indc"></Icon>
                        </DropdownToggle>
                        <DropdownMenu end>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  handlePlanChange(null);
                                }}
                              >
                                <span>All</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  handlePlanChange("1 month")
                                }}
                              >
                                <span>1 month</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  handlePlanChange("3 months")
                                }}
                              >
                                <span>3 months</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  handlePlanChange("6 months")
                                }}
                              >
                                <span>6 months</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                      <Button style={{
                        backgroundColor: "#df8331",
                        border: "1px ",
                        color: "white"
                      }}>
                        <Icon name="plus"></Icon>
                        <span>Add Subscriptions</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <div className="nk-tb-list is-separate nk-tb-ulist">
            <DataTableHead className="nk-tb-item nk-tb-head">
              <DataTableRow>
                <span className="sub-text" style={{ fontWeight: "bold" }}>Plans</span>
              </DataTableRow>
              <DataTableRow size="lg">
                <span className="sub-text" style={{ fontWeight: "bold" }}> Purchase Date</span>
              </DataTableRow>
              <DataTableRow size="lg">
                <span className="sub-text" style={{ fontWeight: "bold" }}>Quantity</span>
              </DataTableRow>
              {/* <DataTableRow size="xxl">
                <span className="sub-text" style={{ fontWeight: "bold" }} >Status</span>
              </DataTableRow> */}
              <DataTableRow size="md">
                <span className="sub-text" style={{ fontWeight: "bold" }}>Action</span>
              </DataTableRow>
            </DataTableHead>
            {filteredItems.length > 0
              ? filteredItems.map((item, i) => {
                var days = setDeadlineDays(item.deadline);
                return (
                  <DataTableItem key={i}>
                    <DataTableRow>
                      <a
                        href="#title"
                        onClick={(ev) => {
                          ev.preventDefault();

                        }}
                        className="project-title"
                      >
                        {/* <UserAvatar className="sq" theme={item.avatarClass} text={findUpper(item.title)} /> */}
                        <div className="project-info">
                          <h6 className="title">{item.subscriptionPlan}</h6>
                        </div>
                      </a>
                    </DataTableRow>
                    <DataTableRow size="lg">
                    <span>{formatDate(item.subscriptionDate)}</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <span style={{ margin: "auto", marginLeft: "20px" }}>{item.quantity}</span>
                    </DataTableRow>
                    {/* <DataTableRow size="xxl">
                      <span>{days === 0 ? "Closed" : "Open"}</span>
                    </DataTableRow>
                     */}
                    <DataTableRow size="md">
                      <div className="project-list-progress">
                        <Button onClick={() => handleViewPromoCodes(item.promoCodes, item.subscriptionPlan)} className="sub-text" style={{ color: "rgb(112,127,154)", }} onMouseOver={(e) => {
                          e.target.style.color = 'black';
                          e.target.style.fontWeight = 'bolder';
                        }}
                          onMouseOut={(e) => {
                            e.target.style.color = 'rgb(112,127,154)';
                            e.target.style.fontWeight = 'normal';
                          }}
                        >View</Button>
                      </div>
                    </DataTableRow>
                  </DataTableItem>
                );
              })
              : null}
          </div>
          <PreviewAltCard>
            {data.length > 0 ? (
              <PaginationComponent
                itemPerPage={itemPerPage}
                totalItems={data.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            ) : (
              <div className="text-center" >
                <span className="text-silent">No Subscriptions found</span>
              </div>
            )}
          </PreviewAltCard>
        </Block>

        <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add Subscriptions</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Subscriptions</label>
                      <select required id="subscriptionPlan" className="form-select" value={subscriptionPlan} onChange={handleSubscriptionPlanPriceChange}>
                        <option value=""></option>
                        <option value='1 month'>1 month&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 15KD</option>
                        <option value='3 months'>3 months&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 35KD</option>
                        <option value='6 months'>6 months&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 75KD</option>
                      </select>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className="form-control"
                        value={quantity}
                        onChange={handleQuantityPriceChange}
                        ref={register({
                          required: "This field is required",
                        })}
                        required
                      />
                      {errors.totalTask && <span className="invalid">{errors.totalTask.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Subscription Purchase Date</label>
                      <input type="date" id="subscriptionDate" className="form-control" value={subscriptionDate} disabled />
                    </div>
                  </Col>
                  <Col md="6">

                    <div className="form-group">
                      <label className="form-label">Total Amount in KD</label>
                      <input type="number" id="totalAmount" className="form-control" value={totalAmount} disabled />
                    </div>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button onClick={handlePurchase} style={{
                          backgroundColor: "#df8331",
                          border: "1px ",
                          color: "white"
                        }} size="md" type="submit">
                          Purchase
                        </Button>
                      </li>
                      <li>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
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

        <Modal isOpen={modal.edit} toggle={() => setModal({ edit: false })} className="modal-dialog-centered" size="lg">
          <ModalBody >
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title" style={{ position: "sticky", top: "10" }}>Promo codes</h5>
              <div className="mt-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>

                <Table striped bordered responsive >
                  <thead style={{ position: 'sticky', top: "0px" }}>
                    <tr>
                      <th>Codes</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemList.map((item, index) => (
                      <tr key={index}>
                        <td>{item.code}</td>
                        <td>{subscriptionPlan1}</td>
                        <td>{item.status}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* {itemList.map((item, index) => (
                  <EntityTable key={index} data={item} />
                ))} */}
              </div>
            </div>
          </ModalBody>
          <div style={{ width: "90%", margin: "auto", paddingTop: "20px", paddingBottom: "20px" }}>
            <Button style={{
                          backgroundColor: "#df8331",
                          border: "1px ",
                          color: "white"
                        }}  size="md" variant="primary" onClick={handleDownload}>
              Download
            </Button>
            <Button style={{}} variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </div>
        </Modal>

      </Content>
    </React.Fragment >
  );
};

export default ProjectListPage;
