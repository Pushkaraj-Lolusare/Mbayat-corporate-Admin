import React, { useState, useEffect } from "react";
import Head from "../../../../layout/head/Head";
import Content from "../../../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  BlockDes,
  Icon,
  Row,
  Col,
  Button,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  RSelect,
  PreviewAltCard,
} from "../../../../components/Component";
import { DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Badge, Container } from "reactstrap";
import { productData, categoryOptions } from "./ProductData";
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import ProductH from "../../../../images/product/h.png";
import Dropzone from "react-dropzone";
import { Modal, ModalBody } from "reactstrap";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

const ProductList = () => {
  const [data, setData] = useState(productData);

  const [products, setProducts] = useState([]);
  console.log("data", products);
  const [sm, updateSm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    img: null,
    sku: "",
    price: 0,
    stock: 0,
    category: [],
    fav: false,
    check: false,
  });
  const [editId, setEditedId] = useState();
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(12);
  const [files, setFiles] = useState([]);

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = productData.filter((item) => {
        return item.sku.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...productData]);
    }
  }, [onSearchText]);

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // category change
  const onCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      img: null,
      sku: "",
      price: 0,
      stock: 0,
      category: [],
      fav: false,
      check: false,
    });
    reset({});
  };

  const onFormSubmit = (form) => {
    const { title, price, sku, stock } = form;
    let submittedData = {
      id: data.length + 1,
      name: title,
      img: files.length > 0 ? files[0].preview : ProductH,
      sku: sku,
      price: price,
      stock: stock,
      category: formData.category,
      fav: false,
      check: false,
    };
    setData([submittedData, ...data]);
    setView({ open: false });
    setFiles([]);
    resetForm();
  };

  // const onEditSubmit = () => {
  //   let submittedData;
  //   let newItems = data;
  //   let index = newItems.findIndex((item) => item.id === editId);

  //   newItems.forEach((item) => {
  //     if (item.id === editId) {
  //       submittedData = {
  //         id: editId,
  //         name: formData.name,
  //         img: files.length > 0 ? files[0].preview : item.img,
  //         sku: formData.sku,
  //         price: formData.price,
  //         stock: formData.stock,
  //         category: formData.category,
  //         fav: false,
  //         check: false,
  //       };
  //     }
  //   });
  //   newItems[index] = submittedData;
  //   //setData(newItems);
  //   resetForm();
  //   setView({ edit: false, add: false });
  // };

  // function that loads the want to editted data

  const onEditClick = (id) => {
    products.forEach((item) => {
      if (item.id === id) {
        setFormData({
          name: item.name,
          img: item.productImages[1],
          price: item.sellingPrice,
          stock: item.totalQuantity,
          category: item.category,
          description: item.description,
        });
      }
    });
    setEditedId(id);
    setFiles([]);
    setView({ add: false, edit: true });
  };


  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };



  // toggle function to view product details
  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
      details: type === "details" ? true : false,
    });
  };

  // handles ondrop function of dropzone
  const handleDropChange = (acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit, reset } = useForm();

  const selectedVendorId = localStorage.getItem('vendorId');

  const fetchProducts = async () => {
    try {
      const response = await fetch(`https://15.185.57.60/api/v1/product/product-by-vendor/${selectedVendorId}?fetchType=all`, {
        method: 'GET',
      })

      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = async (product) => {
    const userId = localStorage.getItem("userId")
    const accessToken = localStorage.getItem("accessToken")
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/corporateCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${accessToken}`
        },
        body: JSON.stringify({
          imageLink: product.productImages[0],
          brand: product.name,
          description: product.description,
          price: product.sellingPrice,
          userId: userId,
        }),
      });

      if (response.ok) {
        toast.success('Added to cart');
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('An error occurred');
    }
  };

  // Fetch the products data when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <React.Fragment>
      <Head title="Products"></Head>
      <Content >
        <BlockHead size="sm" >
          <BlockBetween >
            <BlockHeadContent>
              <BlockTitle >Products</BlockTitle>
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
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none", zIndex: 1 }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon name="search"></Icon>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Quick search "
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>
                    <li>
                      <UncontrolledDropdown style={{
                        zIndex: 1
                      }}>
                        {/* <DropdownToggle
                          color="transparent"
                          className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                        >
                          Status
                        </DropdownToggle> */}
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
                    </li>
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
                        // color="primary"
                        style={{
                          zIndex: 1,
                          backgroundColor: "#df8331"

                        }}
                      >
                        <Link to="/cart" style={{ color: "white" }}>
                          <Icon name="cart-fill"></Icon>
                          <span>Cart</span></Link>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Container fluid="true" className="mt-4">
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-4 g-4" >
              {currentItems &&
                currentItems.map((item, index) => (
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
                        // minHeight: '270px',
                        height: "400px"
                      }}
                    >
                      <div className="text-center" style={{ height: '200px', }} onClick={(ev) => {
                        ev.preventDefault();
                        onEditClick(item.id);
                        toggle("details");
                      }}>
                        <img src={item.productImages[0]} fluid="true" className="mb-3" style={{ height: '100%', width: "auto", }} alt="App Icon" />
                      </div>
                      <div onClick={(ev) => {
                        ev.preventDefault();
                        onEditClick(item.id);
                        toggle("details");
                      }}>
                        <p
                          style={{
                            fontWeight: 'bold',
                            marginTop: '12px',
                            maxHeight: '34%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          className="mb-2 text-center">{item.name}</p>
                        <p style={{ fontWeight: "bold", }}>{`Price: ${item.sellingPrice} KD`}</p>
                      </div>
                      <Button
                        variant="primary"
                        className="w-75 align-self-center"
                        style={{
                          border: '1px solid black',
                          width: '90%',
                          backgroundColor: 'rgb(73, 197, 182)',
                          margin: 'auto',
                          display: 'block',
                          height: '30px',
                          borderRadius: '5px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          border: 'none',
                          outline: 'none',
                          marginTop: '40px',
                          color: 'rgb(64, 15, 59)',
                        }}
                        onClick={(ev) => {
                          ev.preventDefault();
                          // toast.success("Added to cart")
                          addToCart(item)
                        }}
                      >
                        Add to cart
                      </Button>
                    </div>
                  </Col>
                ))}
            </Row>


          </Container>
          <PreviewAltCard >
            {data.length > 0 ? (
              <PaginationComponent
                itemPerPage={itemPerPage}
                totalItems={data.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            ) : (
              <div className="text-center">
                <span className="text-silent">No products found</span>
              </div>
            )}
          </PreviewAltCard>
        </Block>

        {/* <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update Product</h5>
              <div className="mt-4">
                <form onSubmit={handleSubmit(onEditSubmit)}>
                  <Row className="g-3">
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product-title">
                          Product Title
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            onChange={(e) => onInputChange(e)}
                            ref={register({
                              required: "This field is required",
                            })}
                            defaultValue={formData.name}
                          />
                          {errors.title && <span className="invalid">{errors.title.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="regular-price">
                          Regular Price
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            name="price"
                            onChange={(e) => onInputChange(e)}
                            ref={register({ required: "This is required" })}
                            className="form-control"
                            defaultValue={formData.price}
                          />
                          {errors.price && <span className="invalid">{errors.price.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="sale-price">
                          Sale Price
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className="form-control"
                            name="salePrice"
                            onChange={(e) => onInputChange(e)}
                            ref={register({ required: "This is required" })}
                            defaultValue={formData.price}
                          />
                          {errors.salePrice && <span className="invalid">{errors.salePrice.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="stock">
                          Stock
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className="form-control"
                            name="stock"
                            onChange={(e) => onInputChange(e)}
                            ref={register({ required: "This is required" })}
                            defaultValue={formData.stock}
                          />
                          {errors.stock && <span className="invalid">{errors.stock.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="SKU">
                          SKU
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="sku"
                            onChange={(e) => onInputChange(e)}
                            ref={register({ required: "This is required" })}
                            defaultValue={formData.sku}
                          />
                          {errors.sku && <span className="invalid">{errors.sku.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="category">
                          Category
                        </label>
                        <div className="form-control-wrap">
                          <RSelect
                            isMulti
                            options={categoryOptions}
                            defaultValue={formData.category}
                            onChange={onCategoryChange}
                          //ref={register({ required: "This is required" })}
                          />
                          {errors.category && <span className="invalid">{errors.category.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="category">
                          Product Image
                        </label>
                        <div className="form-control-wrap">
                          <img src={formData.img} alt=""></img>
                        </div>
                      </div>
                    </Col>
                    <Col size="6">
                      <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div
                              {...getRootProps()}
                              className="dropzone upload-zone small bg-lighter my-2 dz-clickable"
                            >
                              <input {...getInputProps()} />
                              {files.length === 0 && <p>Drag 'n' drop some files here, or click to select files</p>}
                              {files.map((file) => (
                                <div
                                  key={file.name}
                                  className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                                >
                                  <div className="dz-image">
                                    <img src={file.preview} alt="preview" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </Col>

                    <Col size="12">
                      <Button color="primary" type="submit">
                        <Icon className="plus"></Icon>
                        <span>Update Product</span>
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal> */}

        <Modal isOpen={view.details} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="nk-modal-head">
              <h4 className="nk-modal-title title">
                Product <small className="text-primary">#{formData.sku}</small>
              </h4>
              <img src={formData.img} alt="" style={{ height: "200px", width: 'auto' }} />
            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">Product Name</span>
                  <span className="caption-text">{formData.name}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Product Price</span>
                  <span className="caption-text">{formData.price} KD</span>
                </Col>

                <Col lg={6}>
                  <span className="sub-text">Stock</span>
                  <span className="caption-text"> {formData.stock}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Description</span>
                  <span className="caption-text"> {formData.description}</span>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>

        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${view.add ? "content-active" : ""
            }`}
        >
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Add Product</BlockTitle>
              <BlockDes>
                <p>Add information or update product.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="product-title">
                      Product Title
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        onChange={(e) => onInputChange(e)}
                        ref={register({
                          required: "This field is required",
                        })}
                        defaultValue={formData.name}
                      />
                      {errors.title && <span className="invalid">{errors.title.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="regular-price">
                      Regular Price
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        name="price"
                        ref={register({ required: "This is required" })}
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        defaultValue={formData.price}
                      />
                      {errors.price && <span className="invalid">{errors.price.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="sale-price">
                      Sale Price
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        className="form-control"
                        name="salePrice"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                        defaultValue={formData.price}
                      />
                      {errors.salePrice && <span className="invalid">{errors.salePrice.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="stock">
                      Stock
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                        defaultValue={formData.stock}
                      />
                      {errors.stock && <span className="invalid">{errors.stock.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="SKU">
                      SKU
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="sku"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                        defaultValue={formData.sku}
                      />
                      {errors.sku && <span className="invalid">{errors.sku.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="category">
                      Category
                    </label>
                    <div className="form-control-wrap">
                      <RSelect
                        name="category"
                        isMulti
                        options={categoryOptions}
                        onChange={onCategoryChange}
                        value={formData.category}
                      //ref={register({ required: "This is required" })}
                      />
                      {errors.category && <span className="invalid">{errors.category.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()} className="dropzone upload-zone small bg-lighter my-2 dz-clickable">
                          <input {...getInputProps()} />
                          {files.length === 0 && <p>Drag 'n' drop some files here, or click to select files</p>}
                          {files.map((file) => (
                            <div
                              key={file.name}
                              className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                            >
                              <div className="dz-image">
                                <img src={file.preview} alt="preview" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </Col>

                <Col size="12">
                  <Button color="primary" type="submit">
                    <Icon className="plus"></Icon>
                    <span>Add Product</span>
                  </Button>
                </Col>
              </Row>
            </form>
          </Block>
        </SimpleBar>
        {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
      </Content>
    </React.Fragment>
  );
};

export default ProductList;
