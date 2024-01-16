import React, { useEffect, useState } from "react";
import { logPageView } from "../analytics";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import styles from "./programs.module.css";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BsPlusCircleDotted } from "react-icons/bs";

import "react-quill/dist/quill.snow.css";
import { getBaseUrl } from "../config/apiconfig";
import { useNavigate } from "react-router";
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import { Button, Modal } from "antd";

const baseUrl = getBaseUrl();
const nlgEndpoint = `${baseUrl}/programs/type`;
const DeleteEndpoint = `${baseUrl}/programs`;
const Program = (props) => {
  const [nlgPrograms, setNlgPrograms] = useState([]);
  const [juniorPrograms, setJuniorPrograms] = useState([]);
  async function fetchData(type) {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get(`${nlgEndpoint}/${type}`, {
        headers: {
          authorization: storedToken,
        },
      });

      const res = response.data;
      if (type === "nlg") {
        const indexToMove = res.findIndex((item) => item._id === "652c18e0085df78d3d175ac9");

if (indexToMove !== -1) {
  // Remove the object from its current position
  const itemToMove = res.splice(indexToMove, 1)[0];

  // Add the object back to the array at the first position
  res.unshift(itemToMove);
}
        setNlgPrograms(res);

      } else {
        setJuniorPrograms(res);
      }
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`Programs Not Found`);
    }
  }

  useEffect(() => {
    logPageView();
    fetchData("nlg");
    fetchData("junior");
  }, []);

  const navigate = useNavigate();

  const openEditor = (id) => {
    navigate(`/programeditor/${id}`);
  };

  const userRole = localStorage.getItem("role");

  const deletHandler = (record) => {
    const storedToken = localStorage.getItem("token");
    const endpoint = `${DeleteEndpoint}/${record._id}`;
    axios
      .delete(endpoint, {
        headers: {
          authorization: storedToken,
        },
      })
      .then((response) => {
        toastr.success(response.data?.message || "Deleted");
        fetchData(record.type);
      })
      .catch((error) => {
        toastr.error(error?.response?.data?.message || "Something went wrong");
      });
  };

  const ProgramAddHandler = (type)=>{
    navigate(`/programeditor/${type}`);
  }
  const momencehandler = (url)=>{
    
      
      window.open(url, '_blank');
  }
  const showDeleteConfirm = (program) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this program?',
      onOk() {
        // User confirmed, call the delete handler
        deletHandler(program);
      },
      onCancel() {
     
      },
    });
  };
  return (
    <div  className={styles.parentConatainer } style={{ width:'100%'}}>
        <Navbar userdata={props.userdata} />
      <div className={styles.mainContainer}>
        <img
        className={styles.mainImamge}
          src="/image/newPro.jpeg"
          alt="programImg"
          
        />
        <div className={styles.overFlowContainer}>
          <h1> PROGRAMS</h1>
          <div style={{ width: "565px", marginTop:'10px' }}>
            <span>
              NEXT LEVEL GOLF is a versatile program focused on improving junior
              golf talent through data-driven analysis and skill building. If
              you are a player ready to drastically improve your game, we have a
              package that will be perfect for your needs.
            </span>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div
        className={styles.container2heading}
        >
          <span style={{ marginRight: "15px" }}>NLG PROGRAMS</span>
          {userRole === "admin" && ( <BsPlusCircleDotted style={{ fontSize: "40px", marginTop:'10px' }} onClick={()=>ProgramAddHandler("nlg")} />)}
        </div>
        <div
          className={`row mx-auto ${styles.cardContainer}`}
        
        >
          {nlgPrograms.map((program, index) => (
            <div className={`col-md-4 ${styles.customCardParent}`}  key={index}>
              <div className={`card h-100 ${styles.Customcard}`} >
                <div
                  className={`card-header mx-auto d-flex justify-content-center align-items-center ${styles.headerCard}`}
                  style={{
                    backgroundColor: `${program.css?.backgroundColor}`,
                    color: `${program.css?.color}`,

                    fontSize: `${program.css?.headerFontSize}`,
                    textTransform: "uppercase",
                    width: "90%",
                    height: "12vh",
                    fontWeight: "bolder",
                  }}
                >
                  <div
                    style={{ marginTop: "10px" }}
                    dangerouslySetInnerHTML={{ __html: program.heading }}
                  />

                  {userRole === "admin" ? (
                    <AiOutlineEdit
                      style={{ cursor: "pointer" , marginLeft:"15px" }}
                      onClick={() => openEditor(program._id)}
                    />
                  ) : (
                    <></>
                  )}
                  {userRole === "admin" ? (
                    <AiOutlineDelete
                      style={{ cursor: "pointer" , marginLeft:"15px"}}
                      onClick={() => showDeleteConfirm(program)}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <div className="card-body">
                  <div className="quill-container ">
                    <div
                      style={{ marginTop: "10px" }}
                      dangerouslySetInnerHTML={{ __html: program.content }}
                    />
                  </div>
                </div>
                    {/* button disabled  */}
                <div className="card-footer">
                  <Button
                    className="btn btn-primary"
                    style={{
                      backgroundColor: `${program.css?.buttonBackgroundColor}`,
                      border: 'none',
                      width: "100%",
                      minHeight:'55px',
                    }}
                    disabled={!program.buttonLink || program.buttonLink.trim() === ''}
                   onClick={()=>momencehandler(program.buttonLink)}
                  >
                    <h4
                      dangerouslySetInnerHTML={{
                        __html: program.buttonDetails,
                      }}
                    />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
        className={styles.container2heading}
        >
          <span style={{ marginRight: "15px" }}>Group Training and Practice Club Membership.</span>
          {userRole === "admin" && <BsPlusCircleDotted style={{ fontSize: "40px", marginTop:'10px' }} onClick={()=>ProgramAddHandler("junior")} />}
        </div>
        <div
          className={`row mx-auto ${styles.cardContainer}`}
        >
          {juniorPrograms.map((program, index) => (
            <div className={`col-md-4 ${styles.customCardParent}`}  key={index}>
            <div className={`card h-100 ${styles.Customcard}`} >
                <div
                 className={`card-header mx-auto d-flex justify-content-center align-items-center ${styles.headerCard}`}
                  style={{
                    backgroundColor: `${program.css?.backgroundColor}`,
                    color: `${program.css?.color}`,

                    fontSize: `${program.css?.headerFontSize}`,
                    textTransform: "uppercase",
                    width: "90%",
                    height: "12vh",
                    fontWeight: "bolder",
                  }}
                >
                  <div
                    style={{ marginTop: "10px" }}
                    dangerouslySetInnerHTML={{ __html: program.heading }}
                  />
                  {userRole === "admin" ? (
                    <AiOutlineEdit
                      style={{ cursor: "pointer", marginLeft:"15px" }}
                      onClick={() => openEditor(program._id)}
                    />
                  ) : (
                    <></>
                  )}
                  {userRole === "admin" ? (
                    <AiOutlineDelete
                      style={{ cursor: "pointer" ,marginLeft:"15px"}}
                      onClick={() => showDeleteConfirm(program)}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <div className="card-body">
                  <div className="quill-container ">
                    <div
                      style={{ marginTop: "10px" }}
                      dangerouslySetInnerHTML={{ __html: program.content }}
                    />
                  </div>
                </div>

                <div className="card-footer">
                  <Button
                    className="btn btn-primary"
                    style={{
                      backgroundColor: `${program.css?.buttonBackgroundColor}`,
                      border:'none',
                      width: "100%",
                      minHeight: "55px",
                    }}
                    disabled={!program.buttonLink || program.buttonLink.trim() === ''}
                   onClick={()=>momencehandler(program.buttonLink)}
                  >
                    <h4
                      dangerouslySetInnerHTML={{
                        __html: program.buttonDetails,
                      }}
                    />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Program;
