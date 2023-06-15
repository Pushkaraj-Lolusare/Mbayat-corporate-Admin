import React, { useState } from 'react'
import Content from '../../../../layout/content/Content'
import { Block, BlockBetween, BlockHead, BlockHeadContent, BlockTitle, DataTableHead, DataTableItem, DataTableRow, Icon, PaginationComponent, PreviewAltCard, TooltipComponent } from '../../../../components/Component';
import { Badge, Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import Head from '../../../../layout/head/Head';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { orderData } from "../order/OrderData";



const cartPage = () => {
  const [data, setData] = useState(orderData);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);


  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [count1, setCount1] = useState(1);
  const [count2, setCount2] = useState(1);
  const [count3, setCount3] = useState(1);

  const handleAdd1 = () => {
    setCount1(count1 + 1);
  };

  const handleAdd2 = () => {
    setCount2(count2 + 1);
  };

  const handleAdd3 = () => {
    setCount3(count3 + 1);
  };

  const handleSubtract1 = () => {
    setCount1(count1 - 1);
  };

  const handleSubtract2 = () => {
    setCount2(count2 - 1);
  };

  const handleSubtract3 = () => {
    setCount3(count3 - 1);
  };

  return (
    // <React.Fragment>
    //     <Head title="Cart"></Head>
    //     <Content>
    //     <BlockHead size="sm" >
    //       <BlockBetween >
    //         <BlockHeadContent>
    //           <BlockTitle >Cart</BlockTitle>
    //         </BlockHeadContent>
    //         <BlockHeadContent>
    //           <div className="toggle-wrap nk-block-tools-toggle">
    //             <a
    //               href="#more"
    //               className="btn btn-icon btn-trigger toggle-expand me-n1"
    //               onClick={(ev) => {
    //                 ev.preventDefault();
    //                 updateSm(!sm);
    //               }}
    //             >
    //               <Icon name="more-v"></Icon>
    //             </a>
    //             <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
    //               <ul className="nk-block-tools g-3">
    //                 <li>
    //                   <div className="form-control-wrap">
    //                     <div className="form-icon form-icon-right">
    //                       <Icon name="search"></Icon>
    //                     </div>
    //                     <input
    //                       type="text"
    //                       className="form-control"
    //                       id="default-04"
    //                       placeholder="Quick search by SKU"
    //                       onChange={(e) => onFilterChange(e)}
    //                     />
    //                   </div>
    //                 </li>
    //                 <li>
    //                   <UncontrolledDropdown>
    //                     <DropdownToggle
    //                       color="transparent"
    //                       className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
    //                     >
    //                       Status
    //                     </DropdownToggle>
    //                     <DropdownMenu >
    //                       <ul className="link-list-opt no-bdr">
    //                         <li>
    //                           <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
    //                             <span>New Items</span>
    //                           </DropdownItem>
    //                         </li>
    //                         <li>
    //                           <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
    //                             <span>Featured</span>
    //                           </DropdownItem>
    //                         </li>
    //                         <li>
    //                           <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
    //                             <span>Out of Stock</span>
    //                           </DropdownItem>
    //                         </li>
    //                       </ul>
    //                     </DropdownMenu>
    //                   </UncontrolledDropdown>
    //                 </li>
    //                 <li className="nk-block-tools-opt">
    //                   {/* <Button
    //                     className="toggle btn-icon d-md-none"
    //                     color="primary"
    //                     onClick={() => {
    //                       toggle("add");
    //                     }}
    //                   >
    //                     <Icon name="plus"></Icon>
    //                   </Button> */}
    //                   <Button
    //                     className="toggle d-none d-md-inline-flex"
    //                     color="primary"
    //                     onClick={() => {

    //                     }}
    //                   >
    //                     <Link to="/cart" style={{color:"white"}}>
    //                     <Icon name="cart-fill"></Icon>
    //                     <span>Cart</span></Link>
    //                   </Button>
    //                 </li>
    //               </ul>
    //             </div>
    //           </div>
    //         </BlockHeadContent>
    //       </BlockBetween>
    //     </BlockHead>
    //     </Content>
    // </React.Fragment>
    <>
      <Head title="Cart"></Head>
      {/* <h1>Cart PAge</h1>
         */}
      <Content>
        <BlockHead size="sm" >
          <BlockBetween >
            <BlockHeadContent>
              <BlockTitle ><Icon name="cart"></Icon> Shopping Cart</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#more"
                  className="btn btn-icon btn-trigger toggle-expand me-n1"
                  onClick={(ev) => {
                    ev.preventDefault();
                    updateSm(!sm);
                  }}
                >
                  <Icon name="more-v"></Icon>
                </a>
                <div className="toggle-expand-content" style={{ display: "sm" ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    {/* <li>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon name="search"></Icon>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Quick search by SKU"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li> */}
                    {/* <li>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color="transparent"
                          className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                        >
                          Status
                        </DropdownToggle>
                        <DropdownMenu end>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>New Items</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Featured</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Out of Stock</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li> */}
                    <li className="nk-block-tools-opt">
                      {/* <Button
                        className="toggle btn-icon d-md-none"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                      </Button> */}
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => {
                          alert("Payment Page loading......")
                        }}
                      >
                        {/* <Link to="/cart" style={{color:"white"}}> */}
                        <Icon name="bag"></Icon>
                        <span>Purchase Selected Items</span>
                        {/* </Link> */}
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
      </Content>


      {/* <Block>
        <div className="nk-tb-list is-separate is-medium mb-3">
          <DataTableHead className="nk-tb-item">
            <DataTableRow className="nk-tb-col-check">
              <div className="custom-control custom-control-sm custom-checkbox notext">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="pid-all"
                  onChange={(e) => selectorCheck(e)}
                />
                <label className="custom-control-label" htmlFor="pid-all"></label>
              </div>
            </DataTableRow>
            <DataTableRow>
              <span className="sub-text">Order</span>
            </DataTableRow>
            <DataTableRow size="sm">
              <span className="sub-text">Customer</span>
            </DataTableRow>
            <DataTableRow size="md">
              <span className="sub-text">Date</span>
            </DataTableRow>
            <DataTableRow>
              <span className="sub-text">Status</span>
            </DataTableRow>
            <DataTableRow size="md">
              <span className="sub-text">Purchased</span>
            </DataTableRow>
            <DataTableRow>
              <span className="sub-text">Total</span>
            </DataTableRow>
            <DataTableRow className="nk-tb-col-tools">
              <ul className="nk-tb-actions gx-1 my-n1">
                <li>
                  <UncontrolledDropdown>
                    <DropdownToggle tag="a" className="btn btn-trigger dropdown-toggle btn-icon me-n1">
                      <Icon name="more-h"></Icon>
                    </DropdownToggle>
                    <DropdownMenu end>
                      <ul className="link-list-opt no-bdr">
                        <li>
                          <DropdownItem
                            tag="a"
                            href="#markasdone"
                            onClick={(ev) => {
                              ev.preventDefault();
                              selectorMarkAsDelivered();
                            }}
                          >
                            <Icon name="truck"></Icon>
                            <span>Mark As Delivered</span>
                          </DropdownItem>
                        </li>
                        <li>
                          <DropdownItem
                            tag="a"
                            href="#remove"
                            onClick={(ev) => {
                              ev.preventDefault();
                              selectorDeleteOrder();
                            }}
                          >
                            <Icon name="trash"></Icon>
                            <span>Remove Orders</span>
                          </DropdownItem>
                        </li>
                      </ul>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </li>
              </ul>
            </DataTableRow>
          </DataTableHead>

          {currentItems.length > 0
            ? currentItems.map((item) => (
              <DataTableItem key={item.id}>
                <DataTableRow className="nk-tb-col-check">
                  <div className="custom-control custom-control-sm custom-checkbox notext">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      defaultChecked={item.check}
                      id={item.id + "oId-all"}
                      key={Math.random()}
                      onChange={(e) => onSelectChange(e, item.id)}
                    />
                    <label className="custom-control-label" htmlFor={item.id + "oId-all"}></label>
                  </div>
                </DataTableRow>
                <DataTableRow>
                  <a href="#id" onClick={(ev) => ev.preventDefault()}>
                    #{item.orderId}
                  </a>
                </DataTableRow>
                <DataTableRow size="sm">
                  <span className="tb-sub">{item.customer}</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>{item.date}</span>
                </DataTableRow>
                <DataTableRow>
                  <span
                    className={`dot bg-${item.status === "Delivered" ? "success" : "warning"} d-sm-none`}
                  ></span>
                  <Badge
                    className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                    color={
                      item.status === "Delivered" ? "success" : "warning"
                    }
                  >
                    {item.status}
                  </Badge>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="tb-sub text-primary">{item.purchased}</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="tb-lead">$ {item.total}</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools">
                  <ul className="nk-tb-actions gx-1">
                    {item.status !== "Delivered" && (
                      <li className="nk-tb-action-hidden" onClick={() => markAsDelivered(item.id)}>
                        <TooltipComponent
                          tag="a"
                          containerClassName="btn btn-trigger btn-icon"
                          id={"delivery" + item.id}
                          icon="truck"
                          direction="top"
                          text="Mark as Delivered"
                        />
                      </li>
                    )}
                    <li
                      className="nk-tb-action-hidden"
                      onClick={() => {
                        loadDetail(item.id);
                        toggle("details");
                      }}
                    >
                      <TooltipComponent
                        tag="a"
                        containerClassName="btn btn-trigger btn-icon"
                        id={"view" + item.id}
                        icon="eye"
                        direction="top"
                        text="View Details"
                      />
                    </li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-icon dropdown-toggle btn-trigger">
                          <Icon name="more-h"></Icon>
                        </DropdownToggle>
                        <DropdownMenu end>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdown"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  loadDetail(item.id);
                                  toggle("details");
                                }}
                              >
                                <Icon name="eye"></Icon>
                                <span>Order Details</span>
                              </DropdownItem>
                            </li>
                            {item.status !== "Delivered" && (
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#dropdown"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    markAsDelivered(item.id);
                                  }}
                                >
                                  <Icon name="truck"></Icon>
                                  <span>Mark as Delivered</span>
                                </DropdownItem>
                              </li>
                            )}
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdown"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  deleteOrder(item.id);
                                }}
                              >
                                <Icon name="trash"></Icon>
                                <span>Remove Order</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                  </ul>
                </DataTableRow>
              </DataTableItem>
            ))
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
              <span className="text-silent">No orders found</span>
            </div>
          )}
        </PreviewAltCard>
      </Block> */}
      <div style={{ width: "100%", height: "65vh" }}>
        <div style={{ width: "60%", height: "95%", marginTop: "12px" }}>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", marginLeft: "100px", backgroundColor: "white", borderRadius: "30px",  width: "60%", height: "150px", marginTop: "12px", paddingLeft:"", boxShadow:"box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px" }}>
              <img src="App_Icon.png" style={{ marginLeft:"20px",borderRadius:"13px",marginTop:"8px",width: '30%', height: "90%",  }} />
              <div>
                <p style={{fontWeight:"bold", fontSize:"20px"}}>Product Name</p>
                <p style={{fontWeight:"500"}}>Price: 999 KWD</p>
                <div style={{display:'flex', marginTop:"30px", justifyContent:'space-between'}}>
                  <button style={{fontWeight:"bolder", fontSize:"16px", backgroundColor:'rgb(199,205,215)',border:'none',borderRadius:"5px", width:"30px", height:"30px", boxShadow:"box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"}} disabled={count1 === 1} onClick={handleSubtract1}>-</button>
                  <div style={{fontSize:'20px', fontWeight:"bold"}}>{count1}</div>
                  <button style={{fontWeight:"bolder", fontSize:"16px", backgroundColor:'rgb(199,205,215)',border:'none',borderRadius:"5px",width:"30px", height:"30px", boxShadow:"box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"}} onClick={handleAdd1}>+</button>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: "white", marginLeft: "10px", borderRadius: "30px", width: "10%", height: "150px", marginTop: "12px" }}>
            <img src="https://th.bing.com/th/id/OIP.WGtzC7vWEvzFlj6oDtB48gHaId?w=166&h=191&c=7&r=0&o=5&dpr=1.3&pid=1.7" style={{width:'40%', height:"24%", margin:"auto", marginTop:"60px", marginLeft:"25px"}}/>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", marginLeft: "100px", backgroundColor: "white", borderRadius: "30px",  width: "60%", height: "150px", marginTop: "12px" , paddingLeft:""}}>
              <img src="App_Icon.png" style={{ marginLeft:"20px",borderRadius:"13px",marginTop:"8px",width: '30%', height: "90%",  }} />
              <div>
                <p style={{fontWeight:"bold", fontSize:"20px"}}>Product Name</p>
                <p style={{fontWeight:"500"}}>Price: 999 KWD</p>
                <div style={{display:'flex', marginTop:"30px", justifyContent:'space-between'}}>
                  <button style={{fontWeight:"bolder", fontSize:"16px", backgroundColor:'rgb(199,205,215)',border:'none',borderRadius:"5px", width:"30px", height:"30px", boxShadow:"box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"}} disabled={count2 === 1} onClick={handleSubtract2}>-</button>
                  <div style={{fontSize:'20px', fontWeight:"bold"}}>{count2}</div>
                  <button style={{fontWeight:"bolder", fontSize:"16px", backgroundColor:'rgb(199,205,215)',border:'none',borderRadius:"5px",width:"30px", height:"30px", boxShadow:"box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"}} onClick={handleAdd2}>+</button>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: "white", marginLeft: "10px", borderRadius: "30px",  width: "10%", height: "150px", marginTop: "12px" }}>
              <img src="https://th.bing.com/th/id/OIP.WGtzC7vWEvzFlj6oDtB48gHaId?w=166&h=191&c=7&r=0&o=5&dpr=1.3&pid=1.7" style={{width:'40%', height:"24%", margin:"auto", marginTop:"60px", marginLeft:"25px"}}/>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", marginLeft: "100px", backgroundColor: "white", borderRadius: "30px", width: "60%", height: "150px", marginTop: "12px", paddingLeft:"" }}>
              <img src="App_Icon.png" style={{ marginLeft:"20px",borderRadius:"13px",marginTop:"8px", width: '30%', height: "90%",  }} />
              <div>
                <p style={{fontWeight:"bold", fontSize:"20px"}}>Product Name</p>
                <p style={{fontWeight:"500"}}>Price: 999 KWD</p>
                <div style={{display:'flex', marginTop:"30px", justifyContent:'space-between'}}>
                  <button style={{fontWeight:"bolder", fontSize:"16px", backgroundColor:'rgb(199,205,215)',border:'none',borderRadius:"5px", width:"30px", height:"30px", boxShadow:"box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px", outline:"none"}} disabled={count3 === 1} onClick={handleSubtract3}>-</button>
                  <div style={{fontSize:'20px', fontWeight:"bold"}}>{count3}</div>
                  <button style={{fontWeight:"bolder", fontSize:"16px", backgroundColor:'rgb(199,205,215)',border:'none',borderRadius:"5px",width:"30px", height:"30px", boxShadow:"box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px" , outline:"none"}} onClick={handleAdd3}>+</button>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: "white", marginLeft: "10px", borderRadius: "30px",  width: "10%", height: "150px", marginTop: "12px" }}>
            <img src="https://th.bing.com/th/id/OIP.WGtzC7vWEvzFlj6oDtB48gHaId?w=166&h=191&c=7&r=0&o=5&dpr=1.3&pid=1.7" style={{width:'40%', height:"24%", margin:"auto", marginTop:"60px", marginLeft:"25px"}}/>
            </div>
          </div>

        </div>
        <div style={{width:"2px", height:"60vh", border:"1px solid gray"}}>

        </div>
        <div>

        </div>
      </div>

    </>
  )
}

export default cartPage