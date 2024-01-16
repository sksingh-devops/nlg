import React, { useState } from "react";
import Navbar from "../navbar/navbar";
import styles from "./contact.module.css";
import Footer from "../footer/footer";
import { getBaseUrl } from "../config/apiconfig";
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
const baseUrl = getBaseUrl();
const ContactEndpoint = `${baseUrl}/contactus`;
const Contact = (props) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const handleSubmit = (event) => {
    
    event.preventDefault(); // Prevent default form submission
    // You can perform additional actions here, like sending data to a server

    setSubmitted(true); // Show the submission message
    console.log(formData);
    ContactApi(formData.email, formData.firstName, formData.lastName, formData.phone,formData.message);
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

  };
  const ContactApi = async ( email, firstname, lastname, phone, message ) => {
    try {
      toastr.clear();

      const response = await axios.post(ContactEndpoint, { email, firstname, lastname, phone, message  });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div>
      <Navbar userdata={props.userdata} />
      <div className={styles.contactContainer}>
        <div className={`col-md-6 ${styles.leftDiv}`}>
          <h1 className={styles.cheading}>
            <span>CONTACT</span>
          </h1>
          <img src="/image/image.jpeg" height={300} width={360}  style={{marginLeft:'100px', marginBottom:'50px'}} />
          <p className={styles.lefttextbold}>
            Interested in learning more about our programs?
          </p>
          <p className={styles.leftTextsub}>
            <span>
              Reach out to our staff and we'll be sure to get back to you within
              48 hrs to respond to your questions on lessons, packages, practice
              clinic and college recruiting for golf.
            </span>
          </p>
        </div>
        <div className={`col-md-6 ${styles.rightDiv}`}>
          <form onSubmit={handleSubmit} className={styles.style0}>
            <div className={styles.style1} data-testid="richTextElement">
              <h2 className={styles.style2}>
                <span className={styles.style3}>Get in Touch</span>
              </h2>
            </div>
            {!submitted && <> <div className={styles.style4}>
              <label for="input_comp-l8ytjy5l" className={styles.style5}>
                First Name
              </label>
              <div className={styles.style6}>
                <input
                  name="firstName"
                  className={styles.style7}
                  type="text"
                  placeholder="e.g., Kat"
                  aria-required="false"
                  maxlength="100"
              onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className={styles.style8}>
              <label for="input_comp-l8ytjy5u" className={styles.style9}>
                Last Name
              </label>
              <div className={styles.style10}>
                <input
                  name="lastName"
                  className={styles.style11}
                  type="text"
                  placeholder="e.g., Jones"
                  aria-required="false"
                  maxlength="100"
              onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className={styles.style12}>
              <label for="input_comp-l8ytjy5z" className={styles.style13}>
                Email
              </label>
              <div className={styles.style14}>
                <input
                  name="email"
                  className={styles.style15}
                  type="email"
                  placeholder="e.g., example@mail.com"
                  required
                  aria-required="true"
                  pattern="^.+@.+\.[a-zA-Z]{2,63}$"
                  maxlength="250"
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className={styles.style16}>
              <label for="input_comp-l8ytjy641" className={styles.style17}>
                Phone
              </label>
              <div className={styles.style18}>
                <input
                  name="phone"
                  className={styles.style19}
                  type="tel"
                  placeholder="e.g., 123-456-7890"
                  aria-required="false"
                  maxlength="50"
              onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className={styles.style20}>
              <label for="textarea_comp-l8ytjy691" className={styles.style21}>
                Message
              </label>
              <textarea
              name="message"
                className={styles.style22}
                rows="1"
                placeholder="Type your message here..."
                aria-required="false"
                defaultValue={formData.message}
              onChange={handleInputChange} 
              ></textarea>
            </div>
            <div className={styles.style23} aria-disabled="false">
              <button
                aria-disabled="false"
                data-testid="buttonElement"
                className={styles.style24}
              >
                <span className={styles.style25}>SUBMIT</span>
              </button>
            </div></>}
            {submitted && (
             
                <p className={styles.submitting} >
                  WE HAVE RECEIVED YOUR EMAIL AND WILL REVERT WITHIN 24 HOURS
                </p>
             
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
