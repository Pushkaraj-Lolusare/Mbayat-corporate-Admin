import React, { useState } from "react";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import { Form, Spinner, Alert } from "reactstrap";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");

  const { errors, register, handleSubmit } = useForm();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrorLogin] = useState('');
  const [alert, setAlert] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch('http://localhost:5500/corporateUser/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(email, password);

      const data = await response.json();
      console.log("data", data);

      if (data.token) { 
        toast.success('Login successful!')
        // setAlert({ type: 'success', message: 'Login successful!' });
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("CompanyName", data.CompanyName);
        localStorage.setItem("Email", data.Email);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("Address", data.Address);
        setTimeout(() => {
          window.history.pushState(
            `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`,
            "auth-login",
            `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`
          );
          window.location.reload();
        }, 2000);
      } else {
        // console.log("Failed");
        // Login failed
        toast.error(data.msg);
        // setAlert({ type: 'danger', message: data.msg });
      }
    } catch (error) {
      // console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
      // setAlert({ type: 'danger', message: 'An error occurred. Please try again later.' });
    }
  };


  const dismissAlert = () => {
    setAlert(null);
  };

  return (
    <React.Fragment>
      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={dismissAlert} />
        </div>
      )}
      <Head title="Login" />

      <PageContainer>

        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
              <img style={{ width: "40px", height: "40px" }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAvCAYAAACc5fiSAAAACXBIWXMAAAWJAAAFiQFtaJ36AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARTSURBVHgB3ZrNbhtVFMf/5zpRE4TUeQHUyY6PjcOmaYWU6a4Eidh5Adw1EnGeIAksWNapYJ3kCWyQorKiUwEpsKCTRVF3GcQDMBVITf1xD+eO0w+ntuO5x1LV/qTIGfve3P+9c849f98JYYocf1WODJtVS1yRy/D07YSYEu7Z7YXtJMWUIEyB481yQDO0y0BlXDuZwJ5MYEMmkEGJWvjx1+UQXbqD5ys8HkaKHi9qxRsooS7tYlLReQdpO0NNKFEJP/6yXJPwiFCcyOUDFKiEE9Fn8IY2ocA7xl1Cyi3/B/5k6PKCb6z7r/gMytARXJili/BEnZyvCn/hXdnWlDzp8CN44i38tApq9uJEs5erQsUwN+CJAe9BgUq47WEHPqsu1dN28R0UqIT3bzVXUZQSV7WGa+Q+HgVRALRDmZu82izODpNRbaUKirmimzi/9GczFpV3Nu/fHdWg+W4llL02zC/mukk1aWUTCY+CqzVwXhGjwU84lVscw9jtOPs1Pduvb7Yg1ZCcQwzOCobLBwmtYQnZLFdC6ph1IsjYg30JFDN6e6sPWvuD7z8THIXgzi7O9R4yASptxNlPrVEt/t5eXLaGQ/e7xPKRvKSjdpDvP1irM8mE+aXJYlAox71ZviF3IO1fPxc9uTXNFaEW//vLPhTkooGbk/fg1M7yoguffnLajjM8IYpg0IiCpRCeuPAoJtpBYaltdvPho+CjCC62ihOAS7vwpNQxXu5QwqoiCRwZWFZYU0T93acYp6tdgydUMqtGVlvn8nrtZRSlV1KNSYyKi3GlPaXCK24Yl6CBELzWtjaFAmKboiCW8BcUMHMqJg0t+JPd+e/e3cK9Sr0YGktMFBsY8ndpzF6TdgWEFAsmh0o7Js5+jmXVPXy1lH7xLfCkZ/O+HpbYblUfttJ+cppZ90eSAt0zyezqMLM1KW5wS7aYJWZOVv9s5Yv1oskK8tJPqJ/TO+2LHm5z6/duh+JjImv6W558SzqSmEwaVz5Oh7Vvvl8pS7w28xOucaPCNioPWhtPr1+ytdfevrLMxtTkk7P2VELKtmAu7MfizocIjqQaujIeDR8asQx2Y/QE1mpEvC429sW6krHkgrG89+nD5sAmMPZAyN0Fc9K++OPJ4djtq374g1hTnsgwEfNG4+rK2Jw6eG/tUvuxfVRNWyNzQH1aW0T0U9hw7dblFZUlVgl38Sy38r4rwYU6Mmc0/2ShsVh9NccTeUwXFe0gCuzJ3DoUaL1KBE8k1utQ4C28/vuBy/4Qvsiqf/7HgbdL9F/xnikeIlPEX3jJqh9AafAXPvtWCg2ys3z74Sfe9tZbeGPxmlvxGL4Qaey08hkQ4O8ODXmf9DpUwsV3xOKri1dA4sY3l68fQYH+O+f8XN25vwI99naWVjagZCqPxB1f/HZ7kyy2RjZgcXqGtm4tXd/BFJiacIfzLpZpldw/IUiBkZ1DfigRaxCb+cf7Gm/yxvA/74+yE5XjA8IAAAAASUVORK5CYII=" alt="logo" />
              <h1 style={{ fontSize: '35px', fontWeight: "500" }}>Mbayat Corporate Login</h1>
            </Link>
          </div>

          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">Sign-In</BlockTitle>
                <BlockDes>
                  <p>Access Mbayat Corporate using your email and passcode.</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            {error && (
              <div className="mb-3">
                <Alert color="danger" className="alert-icon">
                  {" "}
                  <Icon name="alert-circle" /> Unable to login with credentials{" "}
                </Alert>
              </div>
            )}
            <Form className="is-alter" onSubmit={handleLogin}>
              <div className="form-group">
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Email
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="email"
                    id="default-01"
                    name="name"
                    required
                    // ref={register({ required: "This field is required" })}
                    // defaultValue="info@softnio.com"
                    placeholder="Enter your email "
                    className="form-control-lg form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.name && <span className="invalid">{errors.name.message}</span>}
                </div>
              </div>
              <div className="form-group">
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                    Forgot Code?
                  </Link>
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch `}
                  >
                    {/* <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon> */}
                  </a>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    // defaultValue="123456"
                    // ref={register({ required: "This field is required" })}
                    placeholder="Enter your Password"
                    className={`form-control-lg form-control `}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                </div>
              </div>
              <div className="form-group">
                <Button size="lg" className="btn-block" type="submit" color="primary">
                  {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
                </Button>
              </div>
            </Form>
            {/* <div className="form-note-s2 text-center pt-4">
              {" "}
              New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
            </div> */}
            {/* <div className="text-center pt-4 pb-3">
              <h6 className="overline-title overline-title-sap">
                <span>OR</span>
              </h6>
            </div>
            <ul className="nav justify-center gx-4">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Facebook
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Google
                </a>
              </li>
            </ul> */}
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Login;
