import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Radio } from "antd";
import { Button } from "antd";
import { RiCheckboxFill } from "react-icons/ri";
import logo from "../Logo.png";
import toastr from "toastr";
import axios from "axios";
import { getBaseUrl } from "../config/apiconfig";
import "toastr/build/toastr.min.css";
import { useNavigate } from "react-router-dom";
import { Form, Input } from "antd";
import Navbar from "../navbar/navbar";
import styles from "./signup.module.css";
import { ReactSVG } from "react-svg";
import { useGoogleLogin } from '@react-oauth/google';
import { LoginSocialFacebook } from "reactjs-social-login";
const baseUrl = getBaseUrl();
const registerEndPoint = `${baseUrl}/register`;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [gmailEmail, setGmailEmail] = useState();
  const [facebooklEmail, setFacebookEmail] = useState();

  const options = [
    {
      label: "Athlete",
      value: "athlete",
    },
    {
      label: "Coach",
      value: "coach",
    },
    {
      label: "Recruiter",
      value: "recruiter",
    },
  ];

  const [value, setValue] = useState("athlete");

  const onChange = ({ target: { value } }) => {
    setValue(value);
    if (value === "athlete") {
      AthleteformOpenHandler();
    }
    if (value === "coach") {
      CoachformOpenHandler();
    }
    if (value === "recruiter") {
      RecruiterformOpenHandler();
    }
  };

  const handleRegister = async (
    email,
    role,
    businessUrl,
    linkedinProfile,
    name,
    password
  ) => {
    setLoading(true);
    try {
      toastr.clear();

      const response = await axios.post(registerEndPoint, {
        email,
        role,
        businessUrl,
        linkedinProfile,
        name,
        password,
      });
      //TODO:handle validation for emao;

      toastr.success(response.data?.message || "Done");
      navigate("/");
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const [form, setform] = useState({
    isForm: false,
    role: "",
    athleteForm: false,
  });
  const navigate = useNavigate();
  const [readmore, setreadmore] = useState(false);
  const loginHandler = () => {
    navigate("/login");
  };
  const readMoreHandler = () => {
    setreadmore(true);
  };
  const onFinish = (values) => {
    handleRegister(
      values.email,
      form.role,
      values.businessUrl,
      values.linkedinProfile,
      values.name,
      values.password
    );
    // send signup
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const AthleteformOpenHandler = () => {
    setform({
      isForm: true,
      role: "athlete",
      athleteForm: true,
    });
  };
  const CoachformOpenHandler = () => {
    setform({
      isForm: true,
      role: "coach",
      athleteForm: false,
    });
  };
  const RecruiterformOpenHandler = () => {
    setform({
      isForm: true,
      role: "recruiter",
      athleteForm: false,
    });
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
        // handleGmailLogin(res?.data?.email)
        setGmailEmail(res?.data?.email);
        setform({
          isForm: true,
          role: "athlete",
          athleteForm: true,
        });
      }
      catch(error){
        console.log(error);
      }
    }
  });
  const handleFacebookLogin = (email)=>{
setFacebookEmail(email);
setform({
  isForm: true,
  role: "athlete",
  athleteForm: true,
});
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
      <div
        style={{ filter: "blur(3px)", width: "100%", pointerEvents: "none" }}
      >
        {" "}
        <Navbar />
      </div>
      <div>
        <img
          style={{ filter: "blur(3px)", height: "100vh", width: "100%" }}
          src="/image/louis background.webp"
          alt="img"
        />
      </div>

      <div className={styles.container}>
        <div className={styles.closeButton} onClick={crosshandler}>
          X
        </div>
        <ReactSVG
            style={{ cursor: "pointer" }}
            src="/logo.svg"
            wrapper="span"
            beforeInjection={(svg) => {
              svg.classList.add("svg-class-name");
              svg.setAttribute("style", "width: 80px");
            }}
          />

        <h1 style={{ marginBottom: "20px" }}>Sign Up</h1>
        <h3>
          Already a Member?
          <span
            onClick={loginHandler}
            style={{ color: "blue", cursor: "pointer" }}
          >
            {" "}
            Log In
          </span>
        </h3>
        {!form.isForm && (
          <>
            <Button
             onClick={loginGoogle}
              className={styles.antBtn1}
              icon={<FcGoogle className={styles.icon} />}
            >
              Signup With Google
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
              className={styles.antBtn1}
              icon={<FaFacebook className={styles.icon} />}
              type="primary"
            >
              Signup With Facebook
            </Button>
            </LoginSocialFacebook>
            <div className={styles.seperator}>
              <hr className={styles.line} />
              <span className={styles.or}>or</span>
              <hr className={styles.line} />
            </div>
            <Button className={styles.antBtn2} onClick={AthleteformOpenHandler}>
              Signup via Email
            </Button>
          </>
        )}

        {form.isForm && (
          <>
            <Radio.Group
              options={options}
              onChange={onChange}
              value={value}
              optionType="button"
              buttonStyle="solid"
            />

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
                initialValue={gmailEmail || facebooklEmail}
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
                  placeholder="Email"
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                />
              </Form.Item>

              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your name",
                  },
                ]}
              >
                <Input placeholder="Name" />
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
                <Input.Password placeholder="Password" />
              </Form.Item>

              {!form.athleteForm && (
                <>
                  <Form.Item
                    label="BusinessUrl"
                    name="businessUrl"
                    rules={[
                      {
                        required: false,
                        message: "Please enter your business url",
                      },
                    ]}
                  >
                    <Input placeholder="BusinessUrl" />
                  </Form.Item>

                  <Form.Item
                    label="LinkedInUrl"
                    name="linkedinProfile"
                    rules={[
                      {
                        required: false,
                        message: "Please enter your linkedin url",
                      },
                    ]}
                  >
                    <Input placeholder="LinkedInUrl" />
                  </Form.Item>
                </>
              )}
              <Form.Item
                wrapperCol={{
                  span: 24,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ width: "100%", height: "50px", fontSize: "20px" , marginBottom: "10px" }}
                >
                  Sign Up
                </Button>

              </Form.Item>
              
  
            </Form>
           
          </>
        )}

      
      </div>
    </div>
  );
};

export default Signup;
