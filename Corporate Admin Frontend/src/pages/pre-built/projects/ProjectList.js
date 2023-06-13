import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import DatePicker from "react-datepicker";
import { saveAs } from 'file-saver'; // Library for downloading files
import * as XLSX from 'xlsx';

import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Progress,

  ModalBody,
  Modal,
  DropdownItem,
  Form,
  Badge,
  Table
} from "reactstrap";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Icon,
  Button,
  Col,
  UserAvatar,
  PaginationComponent,
  PreviewAltCard,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  RSelect,
} from "../../../components/Component";
import { projectData, teamList } from "./ProjectData";
import { findUpper, setDeadline, setDeadlineDays, calcPercentage } from "../../../utils/Utils";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';



export const ProjectListPage = () => {
  const [sm, updateSm] = useState(false);
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [downloadModal, setdownloadModal] = useState();
  const [data, setData] = useState(projectData);
  const [formData, setFormData] = useState({
    // title: "",
    // subtitle: "",
    // description: "",
    // lead: "",
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

  // console.log("itemList", itemList)

  // console.log("subscriptionsPlan", subscriptionData);
  const token = localStorage.getItem("accessToken")
  const userId = localStorage.getItem("userId")

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('http://localhost:5500/subscriptions', {
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

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // function to reset the form
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

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // submit function to add a new item
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

  // submit function to update a new item
  const onEditSubmit = (sData) => {
    const { title, subtitle, description, tasks, totalTask } = sData;
    let submittedData;
    let newitems = data;
    newitems.forEach((item) => {
      if (item.id === editId) {
        submittedData = {
          id: item.id,
          avatarClass: item.avatarClass,
          title: title,
          subtitle: subtitle,
          desc: description,
          lead: formData.lead,
          tasks: tasks,
          totalTask: totalTask,
          deadline: new Date(`${formData.date}`), // Format ** mm/dd/yyyy
          team: formData.team,
        };
      }
    });
    let index = newitems.findIndex((item) => item.id === editId);
    newitems[index] = submittedData;
    resetForm();
    setModal({ edit: false });
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setFormData({
          title: item.title,
          subtitle: item.subtitle,
          description: item.desc,
          lead: item.lead,
          team: item.team,
          tasks: item.tasks,
          totalTask: item.totalTask,
          date: item.deadline,
        });
        setModal({ edit: true }, { add: false });
        setEditedId(id);
      }
    });
  };

  // function to change the complete a project property
  const completeProject = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].deadline = setDeadline(0);
    setData([...newData]);
  };

  // function to change the check property of an item
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.checked = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // function to change the complete property of an item
  const selectorCompleteProject = () => {
    let newData;
    newData = data.map((item) => {
      if (item.checked === true) item.deadline = setDeadline(0);
      return item;
    });
    setData([...newData]);
  };

  // function to delete the seletected item
  const selectorDeleteProject = () => {
    let newData;
    newData = data.filter((item) => item.checked !== true);
    setData([...newData]);
  };

  // function to change the check property of selected item
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].checked = e.currentTarget.checked;
    setData([...newData]);
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  let currentItems = [];

  if (Array.isArray(subscriptionData)) {
    currentItems = subscriptionData.slice(indexOfFirstItem, indexOfLastItem);
  }

  if (Array.isArray(subscriptionData)) {
    currentItems = subscriptionData.slice(indexOfFirstItem, indexOfLastItem);
  }

  // Change Page
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
    const headers = ['Promo Codes', "Plan"]; // Add more headers as per your item data
    const data = [headers, ...itemList.map((item) => [item, subscriptionPlan1])];

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

  //Post Subscriptions

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

    // Calculate total amount based on selected plan and quantity
    const price = calculatePrice(selectedPlan);
    const calculatedTotalAmount = price * quantity;
    setTotalAmount(calculatedTotalAmount);
  };

  const handleQuantityPriceChange = (event) => {
    const selectedQuantity = event.target.value;
    setQuantity(selectedQuantity);

    // Calculate total amount based on selected plan and quantity
    const price = calculatePrice(subscriptionPlan);
    const calculatedTotalAmount = price * selectedQuantity;
    setTotalAmount(calculatedTotalAmount);
  };


  const calculatePrice = (selectedPlan) => {
    switch (selectedPlan) {
      case '1 month':
        return 15;
      case '2 months':
        return 30;
      case '3 months':
        return 45;
      default:
        return 0;
    }
  };


  // const handleSubscriptionPlanChange = (e) => {
  //   setSubscriptionPlan(e.target.value);
  // };

  // const handleQuantityChange = (e) => {
  //   setQuantity(parseInt(e.target.value));
  // };

  

  const handlePurchase = async () => {
    try {
      const response = await fetch(`http://localhost:5500/subscriptions`, {
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
        console.log("res",res)

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
        
        // Handle successful response, e.g., show a success message
        toast.success('Subscription purchased successfully!');
      } else {
        console.error('Error:', response.status);
        // Handle error response, e.g., show an error message
        toast.error( 'Failed to purchase subscription. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network or other errors
      toast.error('An error occurred. Please try again later.');
    }
  };

//   const handlePurchase = async () => {
//   try {
//     const userID = localStorage.getItem("userId");
//     const paymentResponse = await fetch('http://localhost:5500/paymentgateway', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         "Authorization": "Y2ZmNWM5OTIxYjhiOTY3OWI1OGNhNGE4OTY3MjE2ZTQyNTYyYjY2ZQ=="
//       },
//       body: JSON.stringify({
//         trackid: new Date().getTime(),
//         amount: quantity,
//         currency: totalAmount,
//         payment_type: 1,
//         success_url: `http://15.185.57.60:3000/v1/payment/paymentSuccess?userId=${userID}&amount=${totalAmount}`,
//         error_url: `http://15.185.57.60:3000/v1/payment/paymentError?userId=${userID}&amount=${totalAmount}`,
//         language: 'ENG',
//       }),
//     });

//     const payres = await paymentResponse.json();
//     console.log("payres", payres);

//     if (payres.status && payres.status === true) {
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
//             // Make a post request for subscription only if payment is successful
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
//                 // Perform any necessary actions after successful subscription
//                 // e.g., show success message, update UI, etc.
//                 showAlert('Success', 'Subscription purchased successfully!', 'success');
//               })
//               .catch((error) => {
//                 console.error('Subscription creation failed:', error);
//                 // Handle error condition
//                 showAlert('Error', 'Failed to create subscription. Please try again.', 'danger');
//               });
//           } else {
//             // Handle payment failure condition
//             console.error('Payment failed:', event.data);
//             showAlert('Error', 'Payment failed. Please try again.', 'danger');
//           }
//         }
//       });
//     } else {
//       console.error('Payment failed:', payres.message);
//       showAlert('Error', 'Failed to fetch payment gateway URL', 'danger');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     // Handle network or other errors
//     showAlert('Error', 'An error occurred. Please try again later.', 'danger');
//   }
// };


  const showAlert = (title, message, type) => {
    const alertContainer = document.getElementById('alertContainer');
    const alertHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <strong>${title}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    alertContainer.innerHTML = alertHTML;

    setTimeout(() => {
      const alertElement = alertContainer.querySelector('.alert');
      alertElement.remove();
    }, 3000);
  };

  return (
    <React.Fragment>
      <Head title="Project List"></Head>
      <Content>
        {/* <div id="alertContainer" style={{ marginTop: "-10px", marginBottom: "50px",  }}></div> */}

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
                          <span>Filtered By</span>
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
                                }}
                              >
                                <span>Open</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Closed</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Onhold</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                      <Button color="primary">
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
                <span className="sub-text" style={{ fontWeight: "bold" }}>Date</span>
              </DataTableRow>
              <DataTableRow size="lg">
                <span className="sub-text" style={{ fontWeight: "bold" }}>Quantity</span>
              </DataTableRow>
              <DataTableRow size="xxl">
                <span className="sub-text" style={{ fontWeight: "bold" }} >Status</span>
              </DataTableRow>
              <DataTableRow size="md">
                <span className="sub-text" style={{ fontWeight: "bold" }}>Action</span>
              </DataTableRow>
            </DataTableHead>
            {currentItems.length > 0
              ? currentItems.map((item) => {
                var days = setDeadlineDays(item.deadline);
                return (
                  <DataTableItem key={item.id}>
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
                      <span>{item.subscriptionDate}</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <span style={{ margin: "auto", marginLeft: "20px" }}>{item.quantity}</span>
                    </DataTableRow>
                    <DataTableRow size="xxl">
                      <span>{days === 0 ? "Closed" : "Open"}</span>
                    </DataTableRow>
                    {/* <DataTableRow size="mb">

                      <Badge
                        className="badge-dim"
                        color={
                          days > 10
                            ? "light"
                            : days <= 10 && days >= 2
                              ? "warning"
                              : days === 1
                                ? "danger"
                                : days <= 0 && "success"
                        }
                      >
                        <Icon name="clock"></Icon>
                        <span>{days <= 0 ? "Done" : days === 1 ? "Due Tomorrow" : days + " Days Left"}</span>
                      </Badge>
                    </DataTableRow> */}
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
              <div className="text-center">
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
                        <option value='1 month'>1 month&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 15KWD</option>
                        <option value='2 months'>2 months&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 30KWD</option>
                        <option value='3 months'>3 months&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 45KWD</option>
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
                      <label className="form-label">Subscription Start Date</label>
                      <input type="date" id="subscriptionDate" className="form-control" value={subscriptionDate} disabled />
                    </div>
                  </Col>
                  <Col md="6">

                    <div className="form-group">
                      <label className="form-label">Total Amount in KWD</label>
                      <input type="number" id="totalAmount" className="form-control" value={totalAmount} disabled />
                    </div>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button onClick={handlePurchase} color="primary" size="md" type="submit">
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
                  <thead>
                    <tr>
                      <th>Codes</th>
                      <th>Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemList.map((item, index) => (
                      <tr key={index}>
                        <td>{item}</td>
                        <td>{subscriptionPlan1}</td>
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
            <Button color="primary" size="md" variant="primary" onClick={handleDownload}>
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
