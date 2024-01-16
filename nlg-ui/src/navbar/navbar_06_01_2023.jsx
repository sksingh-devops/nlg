import React, { useState, useEffect } from "react";
import styles from "./navbar.module.css";
import { getBaseUrl } from "../config/apiconfig";
import { ReactSVG } from "react-svg";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChartBar, FaUser } from "react-icons/fa";
import { Modal, Input, Form,  } from "antd";

import {
  FaSignInAlt,
  FaRegCalendarAlt,
  FaRegEnvelope,
  FaBook,
  FaUserFriends,
  FaDollarSign,
} from "react-icons/fa";
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import { Button } from "antd";
import { FiMail } from "react-icons/fi";
import { Dropdown, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons'; 
import { IoIosArrowDown, IoMdNotificationsOutline } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
const baseUrl = getBaseUrl();
let loginEndpoint = `${baseUrl}/user`;
let isReadOnly = false;
const changePasswordEndpoint = `${baseUrl}/users/updatepass`;

const Navbar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
    const { pathname } = location;
    const splitLocations = pathname.split("/");

    const splitLocation = splitLocations.length >0 ? splitLocations[1] : "ok"
    // const { id } = useParams(); //program editor wale page se bhi id mil rhi hai jisse id overwrite hokar loginendpoint bdl jata h then error
  // if (id) {
  //   isReadOnly = true;
  //   const isRole =
  //     props.userdata?.role === "admin" ||
  //     props.userdata?.role === "recruiter" ||
  //     props.userdata?.role === "coach";
  //   if (isRole) {
  //     loginEndpoint = `${baseUrl}/user/${id}`;
  //   } else {
  //     navigate("/login");
  //   }
  // }

  async function fetchData() {
    try {
      toastr.clear();
      let userAPI = loginEndpoint;
      // if (id) {
      //   userAPI = `${baseUrl}/user/${id}`;
      // }
      const storedToken = localStorage.getItem("token");
      const response = await axios.get(userAPI, {
        headers: {
          authorization: storedToken,
        },
      });
      let { name, _id } = response.data;

      localStorage.setItem("UserId", _id);
      if (name != "") {
        localStorage.setItem("name", name);

        name = getUserNameFromEmail(name);
        setUserName(name);
      }
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`User Data Not Found`);
    }
  }

  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setdata] = useState([]);

  const logouthandler = () => {
    localStorage.clear();

    navigate("/");
    window.location.reload();
  };

  const loginhandler = () => {
    navigate("/login");
  };
  const dashboardHandler = (itemName) => {
    setSelectedItem(itemName);
    if (props.userdata?.role === "admin") {
      navigate("/invite");
    } else if (props.userdata?.role === "athlete") {
      navigate("/athletedashboard");
    } else if (props.userdata?.role === "recruiter") {
      navigate("/collegedashboard");
    } else if (props.userdata?.role === "coach") {
      navigate("/coachdashboard");
    } else {
      navigate("/login");
    }
  };
const memberHandler = (itemName)=>{
  setSelectedItem(itemName);
  if (props.userdata?.role !== "") {
    navigate("/member");
  } else {
    navigate("/login");
  }
  
 
}
  const profileHandler = (itemName) => {
    setSelectedItem(itemName);
    if (props.userdata?.role !== "") {
      navigate("/userprofile");
    } else {
      navigate("/login");
    }
  };
  const programHandler = (itemName) => {
    setSelectedItem(itemName);
    navigate("/program");
  };
  const staffHandler = (itemName) => {
    setSelectedItem(itemName);
    navigate("/staff");
  };
  const calendarHandler = (itemName) => {
    setSelectedItem(itemName);
    navigate("/calendar");
  };
  const contactHandler = (itemName) => {
    setSelectedItem(itemName);
    navigate("/contact");
  };
  const bookLessonHandler = (itemName) => {
    setSelectedItem(itemName);
    if(props.userdata?.isLoggedIn ){
      window.open(
        "https://momence.com/Louis-Sauer-Golf/appointment-reservation/7619?boardId=194",
        "_blank"
      );
    }
      else{
        navigate("/login");
    
      }
   
  };
  const bookPracticeHandler = (itemName) => {
    setSelectedItem(itemName);
    if(props.userdata?.isLoggedIn ){
      window.open(
        "https://momence.com/Louis-Sauer-Golf/appointment-reservation/7619?boardId=193",
        "_blank"
      );
    }
      else{
        navigate("/login");
    
      }
  
  };
  
  const partnerHandler = (itemName) => {
    setSelectedItem(itemName);
   
        navigate("/partner");
    
  
  };
  const monthlyChallengeHandler = (itemName) => {
    setSelectedItem(itemName);
    if(props.userdata?.isLoggedIn ){
      navigate("/session");
    }
      else{
        navigate("/login");
    
      }
  
  };
  const memberChatHandler = (itemName) => {
    setSelectedItem(itemName);
    if(props.userdata?.isLoggedIn ){
      navigate("/chat");
    }
      else{
        navigate("/login");
    
      }
   
  }

  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(true);
  };
  const logohandler = () => {
    navigate("/");
  };

  let [userName, setUserName] = useState("");
  useEffect(() => {
    // Assuming you have already stored the email in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      fetchData();
    }
  }, []);

  // Function to extract the part before the "@" symbol
  const getUserNameFromEmail = (email) => {
    if (!email) return "";
    const parts = email.split("@");
    return parts[0];
  };
  const chatHandler = () => {
    navigate("/chat");
  };
  const changepassword = async (password) => {
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      const response = await axios.post(
        changePasswordEndpoint,
        { password },
        {
          headers: {
            authorization: storedToken,
          },
        }
      );
      //TODO:handle validation for emao;

      toastr.success(response.data?.message || "Done");
      setPopupVisible(false);
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  const [isPopupVisible, setPopupVisible] = useState(false);
  const onFinish = (values) => {
    changepassword(values.password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const openPopup = () => {
    setPopupVisible(true);
  };
  
  const closePopup = () => {
    setPopupVisible(false);
  };
  const menu = (
    <Menu>
      <Menu.Item className={styles.menuHover} key="0" onClick={()=>navigate("/leader")}>Player Card</Menu.Item>
      {/* <Menu.Item key="1">Tournament</Menu.Item> */}
      <Menu.Item key="2" onClick={()=>{navigate("/session")}}>Challenge Test</Menu.Item>
      <Menu.Item key="3" onClick={()=>{navigate("/jrchallenge")}}>JR Challenge Test</Menu.Item>
      <Menu.Item key="4"  onClick={()=>navigate("/leader")} >Leaderboard</Menu.Item>
      <Menu.Item key="5"  onClick={()=>navigate("/jrleader")} >JR Leaderboard</Menu.Item>
      <Menu.Item key="6"  onClick={()=>{navigate("/userprofile"); window.location.reload()}}>Player Profile</Menu.Item>
      <Menu.Item key="7" onClick={()=>navigate("/notifications")}>Notifications</Menu.Item>
    </Menu>
  );
  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-black ${styles.mainContainer}`} style={{ backgroundColor:'black'}}>
      <div className={` navbar-brand ${styles.logoContainer}`}>
          <ReactSVG
            style={{ cursor: "pointer" }}
            onClick={logohandler}
            src="/logo.svg"
            wrapper="span"
            beforeInjection={(svg) => {
              svg.classList.add("svg-class-name");
              svg.setAttribute("style", "width: 80px");
            }}
          />
         <span className={styles.navText}> TEST. MEASURE. PERFORM.</span>
{/* TODO add text  */}
        </div>
        <div className={styles.rightSide}>
        {props.userdata?.isLoggedIn && (
          <div style={{ display:'flex', flexDirection:'column', maxWidth:'260px', overflow:"hidden"}}>
            
            <div className={styles.logoutButton}>
              {userName}
              <Dropdown overlay={menu} trigger={['click']}>
              <IoIosArrowDown className={styles.Downarrowicon}/>
              </Dropdown>
            
              
            </div>

            <div className={styles.iconHandler}>
            <UserOutlined style={{cursor: "pointer"}} onClick={()=> {navigate("/profile-ath"); window.location.reload() }} />
            <RiLockPasswordLine style={{cursor: "pointer"}} onClick={openPopup} />
            <LogoutOutlined style={{color: "red", cursor:'pointer'}} onClick={logouthandler}/>
            </div>
            </div>
        )}

        {!props.userdata?.isLoggedIn && (
          <div className={styles.maiNavbarLogin}>
            <button className={styles.loginButton} onClick={loginhandler}>
               Login/Signup
            </button>
          </div>
        )}
<div className={styles.hamburger} onClick={handleClick} >
<svg onClick={handleClick} height="30px"  preserveAspectRatio="xMidYMid meet" data-box="44 61 112 78" viewBox="44 61 112 78" xmlns="http://www.w3.org/2000/svg" data-type="shape" role="img" aria-label="Main Menu">
    <g>
        <path d="M156 61v12H44V61h112z"></path>
        <path d="M156 94v12H44V94h112z"></path>
        <path d="M156 127v12H44v-12h112z"></path>
    </g>
</svg>
</div>
        </div>
      {isOpen && (
        <div className={styles.mainsidebar}>
          <div className={styles.mainsidebarUpperSection}>
            <div
              className={styles.closeButton}
              onClick={() => {
                setIsOpen(false);
              }}
            >
            <CloseOutlined />
            </div>
          </div>
          <div className={styles.sidebar}>
            <ul>
              <li
                onClick={() => dashboardHandler("dashboard")}
                className={
                  splitLocation === "invite" ? styles.selectedItem : ""
                }
              >
               
                Dashboard
              </li>
              <li
                onClick={() => memberHandler("leader")}
                className={
                  splitLocation === "leader" ? styles.selectedItem : ""
                }
              >
                 
                NLG Members
              </li>
              <li
                onClick={() => profileHandler("profile")}
                className={
                  splitLocation === "userprofile" || splitLocation === "profile-ath" ? styles.selectedItem : ""
                }
              >
               
                Profile
              </li>
              <li
                onClick={() => programHandler("programs")}
                className={
                  splitLocation === "program" ? styles.selectedItem : ""
                }
              >
            
                Programs
              </li>
              <li
                onClick={() => staffHandler("nlg-staff")}
                className={
                  splitLocation === "staff" ? styles.selectedItem : ""
                }
              >
               
                NLG Staff
              </li>
              <li
                onClick={() => calendarHandler("calendar")}
                className={
                  splitLocation === "calendar" ? styles.selectedItem : ""
                }
              >
                
                Calendar
              </li>
              <li
                onClick={() => contactHandler("contact")}
                className={
                  splitLocation === "contact" ? styles.selectedItem : ""
                }
              >
              
                Contact
              </li>
              <li
                onClick={() => monthlyChallengeHandler("monthlyChallenge")}
                className={
                  splitLocation === "session" ? styles.selectedItem : ""
                }
              >
              
                NLG Challenge
              </li>
             {props?.userdata?.isLoggedIn && <li
                onClick={() => memberChatHandler("memberChat")}
                className={
                  splitLocation === "chat" ? styles.selectedItem : ""
                }
              >
                  
                Member Chat
              </li>}
              <li
                onClick={() => bookLessonHandler("Book-lesson")}
                className={
                  splitLocation === "Book-lesson" ? styles.selectedItem : ""
                }
              >
             
                Book a Lesson
              </li>
              <li
                onClick={() => bookPracticeHandler("bookPractice")}
                className={
                  splitLocation === "bookPractice" ? styles.selectedItem : ""
                }
              >
               
                Book Practice
              </li>
              <li
                onClick={() => partnerHandler("partner")}
                className={
                  splitLocation === "partner" ? styles.selectedItem : ""
                }
              >
               
               Our Partners
              </li>
            </ul>

          </div>
        </div>
      )}
       <Modal
                title="Change Your pasword"
                visible={isPopupVisible}
                onCancel={closePopup}
                footer={null}
              >
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
                    label="New Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Password cannot be blank",
                      },
                    ]}
                    labelAlign="top"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    wrapperCol={{
                      span: 24,
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        width: "100%",
                        height: "50px",
                        fontSize: "20px",
                      }}
                    >
                      Change Your Password
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
    </nav>
  );
};

export default Navbar;
