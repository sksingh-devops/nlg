import React from "react";
import { Button, Col, Input, Row } from "antd";
import logo from "../Logo.png";
import { ReactSVG } from "react-svg";
import styles from './footer.module.css'
import { getBaseUrl } from "../config/apiconfig";
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import { useState } from "react";
const baseUrl = getBaseUrl();
const loginEndpoint = `${baseUrl}/join`;
const Footer = () => {

  const handleJoin = async (email) => {
    try {
   

      const response = await axios.post(loginEndpoint, { email});

    } catch (error) {
      console.error("Invite failed:", error);
    }
  };

  const [email, setEmail] = useState('');
  const handleEmailChange = (event) => {
    setEmail(event.target.value); // Update the email state as the input value changes
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleJoin(email)
    setEmail("")
    // Handle form submission logic here
  };
  return (
    <div className={styles.mainContainer}>
      <div className="row footer-gopal-gadha" style={{ width: "100%" }}>
        <div
          className="col"
          style={{ color: "white" }}
        >
          <div className="row" >
            <div className={`col-sm-2 footer-check ${styles.logo}`} style={{ alignItems:'center', marginTop:"25px", marginLeft:'40px'}}>
              <ReactSVG
              
                style={{ cursor: "pointer" }}
                src="/logo.svg"
                wrapper="span"
                beforeInjection={(svg) => {
                  svg.classList.add("svg-class-name");
                  svg.setAttribute("style", "width: 97px");
                }}
              />
            </div>
            <div className={`col-sm-9 ${styles.logoText}`} >
              <p className={styles.foot1}  style={{ marginTop: "40px", marginBottom: "0px" }}>
                A LOUIS SAUER PROGRAM{" "}
              </p>
              <p className={styles.foot2}  style={{ marginTop: "10px" }}>
                © 2023 NEXT LEVEL GOLF | Privacy Policy
              </p>
              <p className={styles.foot2}  style={{ marginTop: "10px" }}>
              600 Waukegan Rd 
Unit 107 
Northbrook, IL 60062 
              </p>
            </div>
          </div>
        </div>
        <div
          className={`col ${styles.footerTextJoin}`}
          style={{ color: "white" }}
        >
          <p className={styles.foot3} style={{ marginTop: "40px" }}>STAY CONNECTED TO NLG</p>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
          <input className={styles.joinInput} required placeholder="Enter Email Address" type="email" value={email} onChange={handleEmailChange} />
          <button type="submit" className={styles.Joinbutton}>Newsletter</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Footer;
