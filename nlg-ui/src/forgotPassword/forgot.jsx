import React from "react";
import { Button } from "antd";
import styles from  "./forgot.module.css";
import logo from "../Logo.png";
import { Form, Input } from "antd";
import Navbar from "../navbar/navbar";
import { useNavigate } from "react-router";
import { getBaseUrl } from "../config/apiconfig";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

import axios from "axios";
import { ReactSVG } from "react-svg";

const baseUrl = getBaseUrl();
const forgotEndpoint = `${baseUrl}/password/forgot`;
const Forgot = () => {
  const navigate = useNavigate();
  const handleForgot = async (email) => {
    try {
      toastr.clear();
      
      const response =  await axios.post(forgotEndpoint, { email }, {
       
      });
      toastr.success(response.data?.message || "Password reset Email Sent ");
      navigate('/login');
    } catch (error) {
     
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error.response?.data?.message|| "Unable to reset password");
    }
  };

 
  const onFinish = (values) => {
    handleForgot(values.email)
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    
  };
  const crosshandler = () => {
    navigate("/login");
  };

  return (


    <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div style={{ filter: "blur(3px)", width: "100%" ,  pointerEvents: 'none'}}>
      
      <Navbar />
    </div>
    <div>
        <img
          style={{ filter: "blur(3px)", height: "100vh" , width: "100%"}}
          src="/image/louis background.webp"
          alt="img"
        />
      </div>
    <div className={styles.container}>
      <div className={styles.closebutton} onClick={crosshandler} >X</div>
      <ReactSVG
            style={{ cursor: "pointer" }}
            src="/logo.svg"
            wrapper="span"
            beforeInjection={(svg) => {
              svg.classList.add("svg-class-name");
              svg.setAttribute("style", "width: 80px");
            }}
          />
      <h1 className={styles.forgotH1}>Reset password</h1>
      <h3 className={styles.forgotH3}>Enter your login email and we'll send</h3>
      <h3 className={styles.forgotH3}>you a link to reset your password.</h3>

      <Form
        name="basic"
        labelCol={{
          span: 24,
          style: { marginBottom: "0px" },
        }}
       
        style={{
          maxWidth: 1000,
          marginTop:'20px',
          
          
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
         style={{
          
         
          marginTop:'20px',
          }}
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
          marginTop:'4px',
          borderBottom: '1px solid #384AD3',
     
            }}
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%", height: "50px",marginTop:'4px', fontSize: "20px",backgroundColor: "#384AD3"}}
        >
          Reset Password
        </Button>
      </Form>
    </div>
    </div>
  );
};

export default Forgot;
