import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../assets/images/main-logo.png";
import loginService from "../services/authServices/loginService";

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoad: true,
      email:"",
      password:"",
      submit: false,
      error:{
        email: false,
        password: false,
      },
      errorMessage: ""
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isLoad: false
      })
    }, 500);
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
  }

  validation = () => {
    let success = true;
    let error = this.state.error;

    error.email = false;
    error.password = false;

    if(!this.state.email){
      success = false;
      error.email = true;
    }
    if(!this.state.password){
      success = false;
      error.password = true;
    }

    this.setState({ error })
    return success;
  }

  userLogin = async () => {
    const data = {
      email: this.state.email,
      password: this.state.password,
    }

    if(this.validation()){
      this.setState({
        submit: true,
      });
      const callLoginApi = await loginService(data);
      const { history } = this.props;
      if(callLoginApi.status === 'success'){
        window.location.href = '/dashboard';
      }else{
        this.setState({
          errorMessage: callLoginApi.message
        })
      }
      this.setState({
        submit: false,
      });
    }
  }

  render() {
    return (
      <div className="theme-cyan">
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={require('../assets/images/logo-icon.svg')} width="48" height="48" alt="Lucid" /></div>
            <p>Please wait...</p>
          </div>
        </div>
        <div className="hide-border">
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                <div className="top">
                  <img src={Logo} alt="Lucid" style={{ height: "auto", margin: "10px" }} />
                  <h1>Mbayat</h1>
                </div>
                <div className="card">
                  <div className="header">
                    <p className="lead">Login to your account</p>
                  </div>

                  <div className="body">
                    <p className="text-danger"><small>{ this.state.errorMessage }</small></p>
                    <div className="form-auth-small">
                      <div className="form-group">
                        <label className="control-label sr-only">Email</label>
                        <input
                          className={`form-control ${
                              this.state.error.email && "parsley-error"
                          }`}
                          id="signin-email"
                          placeholder="Email"
                          type="email"
                          value={this.state.email}
                          onChange={val => {
                            this.setState({ email: val.target.value, submit: false });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only">
                          Password
                        </label>
                        <input
                            className={`form-control ${
                                this.state.error.password && "parsley-error"
                            }`}
                          id="signin-password"
                          placeholder="Password"
                          type="password"
                          value={this.state.password}
                          onChange={val => {
                            this.setState({ password: val.target.value, submit: false });
                          }}
                        />
                      </div>
                      <div className="form-group clearfix">
                        <label className="fancy-checkbox element-left">
                          <input type="checkbox" />
                          <span>Remember me</span>
                        </label>
                      </div>
                      <button className="btn btn-primary btn-lg btn-block" disabled={this.state.submit} onClick={() => { this.userLogin(); } }>Login</button>
                      <div className="bottom">
                        {/*<span className="helper-text m-b-10">*/}
                        {/*  <i className="fa fa-lock"></i>{" "}*/}
                        {/*  <a href={`${process.env.PUBLIC_URL}/forgotpassword`} */}
                        {/*  >*/}
                        {/*    Forgot password?*/}
                        {/*  </a>*/}
                        {/*</span>*/}
                        {/*<span>*/}
                        {/*  Don't have an account?{" "}*/}
                        {/*  <a href="registration" >Register</a>*/}
                        {/*</span>*/}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;

// Login.propTypes = {
//   updateEmail: PropTypes.func.isRequired,
//   updatePassword: PropTypes.func.isRequired,
//   email: PropTypes.string.isRequired,
//   password: PropTypes.string.isRequired
// };
//
// const mapStateToProps = ({ loginReducer }) => ({
//   email: loginReducer.email,
//   password: loginReducer.password
// });
//
// export default connect(mapStateToProps, {
//   updateEmail,
//   updatePassword,
//   onLoggedin
// })(Login);
