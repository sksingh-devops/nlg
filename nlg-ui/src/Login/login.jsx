import React, { useState } from "react";
import { Button } from "antd";
import styles from "./login.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../Logo.png";
import { Form, Input } from "antd";
import Navbar from "../navbar/navbar";
import { getBaseUrl } from "../config/apiconfig";
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import { ReactSVG } from "react-svg";
import { useGoogleLogin } from '@react-oauth/google';
import {
  
  LoginSocialFacebook,
} from 'reactjs-social-login';

const baseUrl = getBaseUrl();
const loginEndpoint = `${baseUrl}/login`;
const loginG = `${baseUrl}/auth/google-login`;
const facebookG = `${baseUrl}/auth/facebook-login`;
const Login = (props) => {
  const handleLogin = async (email, password) => {
    try {
      toastr.clear();

      const response = await axios.post(loginEndpoint, { email, password });

      const { token, role } = response.data;
      // const { userData, role, token } = data;

      // setUserData(userData);

      // Save the token to local storage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email",email);
      props.tokenStateChangeHandler(token, role);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`Login Failed `);
    }
  };
  const handleGmailLogin = async (email , accessToken) => {
    try {
      toastr.clear();
console.log(email);
      const response = await axios.post(loginG, { email,accessToken});

      const { token, role } = response.data;
     

      // Save the token to local storage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email",email);
      props.tokenStateChangeHandler(token, role);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`Login Failed `);
    }
  };
  const handleFacebookLogin = async (email ) => {
    try {
      toastr.clear();
console.log(email);
      const response = await axios.post(facebookG, { email});

      const { token, role } = response.data;
     

      // Save the token to local storage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email",email);
      props.tokenStateChangeHandler(token, role);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`Login Failed `);
    }
  };
  const [form, setform] = useState(false);
  const navigate = useNavigate();
  const SignUpHandler = () => {
    navigate("/signup");
  };
  const onFinish = (values) => {
    handleLogin(values.email, values.password);
      };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const formOpenHandler = () => {
    setform(true);
  };
  const forgotPasswordHandler = () => {
    navigate("/forgot");
  };
  const crosshandler = () => {
    navigate("/");
  };
  const loginGoogle = useGoogleLogin({
    onSuccess:  async (response) => {
      console.log(response);
      try{
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {Authorization: `Bearer ${response.access_token}`},
        },
        );
        console.log(res);
        handleGmailLogin(res?.data?.email , response.access_token)
      }
      catch(error){
        console.log(error);
      }
    }
  });
  return (
    <div
      style={{
        width: '100%',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{ filter: "blur(1px)", width: "100%", pointerEvents: "none" }}
      >
        {" "}
        <Navbar />
      </div>
      <div  style={{   zIndex:"-1", width: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)",overflow:'hidden', height:'100vh'}}>
        {/* <img
          style={{ filter: "blur(3px)", height: "100vh", width: "100%" }}
          src="/image/louis background.webp"
          alt="img"
        /> */}

      </div>
      <div className={styles.container}>
      <ReactSVG
            style={{ cursor: "pointer" }}
            src="/logo.svg"
            wrapper="span"
            beforeInjection={(svg) => {
              svg.classList.add("svg-class-name");
              svg.setAttribute("style", "width: 80px");
            }}
          />

        <div className={styles.closebutton} onClick={crosshandler}>
          X
        </div>
        <h1 style={{ marginBottom: "20px" }}>Log In</h1>
        <h3>
          New to this site?
          <span
            onClick={SignUpHandler}
            style={{ color: "blue", cursor: "pointer" }}
          >
            {" "}
            Sign Up
          </span>
        </h3>
        {!form && (
          <>
             <Button
             onClick={loginGoogle}
              className={styles.antbtn1}
              icon={<FcGoogle className={styles.icon} />}
            >
              Login With Google
            </Button>
            <LoginSocialFacebook 
            appId="202888452782166"
            onResolve={(response)=>{
              try{
                handleFacebookLogin(response?.data?.email)}
                catch(error){
                  console.log(error);
                }
            }}
            >
            <Button
              className={styles.antbtn1}
              icon={<FaFacebook className={styles.icon} />}
              type="primary"
            >
              Login With Facebook
            </Button>
            </LoginSocialFacebook>
                        <div className={styles.seperator}>
              <hr className={styles.line} />
              <span className={styles.or}>or</span>
              <hr className={styles.line} />
            </div>
            <Button className={styles.antbtn2} onClick={formOpenHandler}>
              Login With Email
            </Button>
          </>
        )}
        {form && (
          <Form
            name="basic"
            labelCol={{
              span: 24,
              style: { marginBottom: "0px" },
            }}
            wrapperCol={{
              span: 24,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email cannot be blank",
                },
                {
                  type: "email",
                  message: "Invalid email",
                },
              ]}
              labelAlign="top"
            >
              <Input
                style={{
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                }}
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Make sure you enter a password!",
                },
              ]}
              labelAlign="top"
            >
              <Input.Password
                style={{
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                }}
              />
            </Form.Item>

            <Form.Item
              name="forgotPassword"
              wrapperCol={{
                offset: 0,
                span: 24,
              }}
            >
              <span
                onClick={forgotPasswordHandler}
                style={{ cursor: "pointer" }}
              >
                {" "}
                Forgot Password?
              </span>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 24,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", height: "50px", fontSize: "20px" }}
              >
                Log In
              </Button>
            </Form.Item>
           
          </Form>
        )}
      </div>
    </div>
  );
};

export default Login;
