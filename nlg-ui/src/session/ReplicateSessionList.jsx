import React, { useEffect, useState } from "react";
import { BsArchive, BsPlusCircleDotted } from "react-icons/bs";
import { MdRestorePage } from "react-icons/md";
import {
  DeleteOutlined,
  HistoryOutlined,
  SettingOutlined,
  RightCircleOutlined,
  CopyOutlined,
  EditOutlined,
} from "@ant-design/icons";
import toastr from "toastr";
import axios from "axios";
import { getBaseUrl } from "../config/apiconfig";
import "toastr/build/toastr.min.css";
import { Empty, Spin, Modal, Button, Input, Dropdown, Menu, Icon } from "antd";
import "./session.css";
import { Card, Col, Row } from "antd";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import AddTestModal from "./addtest";
import { useNavigate } from "react-router-dom";
import ViewAthleteTest from "../athlete/ViewAthleteTest";
import EditTestModal from "./editTestModal";
const ReplicateSessionList = (props) => {
  const userRole = localStorage.getItem("role");
  const [name, setName] = useState("");
  const [testDbId, setTestDbId] = useState(-1);
  const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);
  const [isView, setIsView] = useState(false);
  // const[isDeleted, setisDeleted] = useState(false);
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editloading, setEditLoading] = useState(false);
  const [testId, setTestId] = useState();
  const [data, setData] = useState([]); // State to store the added videos
  const isAdmin = userRole === "admin";
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleEditCancelModal = () => {
    setIsEditModalVisible(false);
  };

  const handleCloneCancel = () => {
    setIsCloneModalVisible(false);
  };
  const handleClone = async () => {
    const endpoint = `${getBaseUrl()}/tests/clone/${testDbId}`;
    try {
      toastr.clear();
      setLoading(true);
      const storedToken = localStorage.getItem("token");
      const response = await axios.post(
        endpoint,
        {
          newName: name,
        },
        {
          headers: {
            authorization: storedToken,
          },
        }
      );

      toastr.success(response.data?.message || "Test Cloned");
      fetchData();
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsCloneModalVisible(false);
      setLoading(false); // Set loading to false when the request is complete
    }
  };
  async function fetchData() {
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      let userAPI = `${getBaseUrl()}/tests`;
      setLoading(true);
      const response = await axios.get(userAPI, {
        headers: {
          authorization: storedToken,
        },
      });
      setData(response.data);
    } catch (error) {
      console.log(error);
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
  }

  const handleCreate = async (values) => {
    if (!values.video || !values.video?.length) {
      toastr.error("Please Select Video for This Test");
      return;
    }
    // Create a new video object with the provided title and videoFile
    const levelsArrJSON = JSON.stringify(values.levelsArr || []);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("name", values.name);
    formData.append("levelsArr", levelsArrJSON);
    formData.append("totalShots", values.totalShots);
    formData.append("timed", values.timed || 0);
    formData.append("testtype", values.testtype);
    formData.append("includeAttempts", values.includeAttempts || false);
    formData.append("includeDistance", values.includeDistance || false);
    formData.append("includeTime", values.includeTime || false);
    formData.append("isPractice", values.option === "practice");

    formData.append("videoFile", values.video[0].originFileObj);
    const endpoint = `${getBaseUrl()}/tests`;
    try {
      toastr.clear();
      setLoading(true);
      const storedToken = localStorage.getItem("token");
      const response = await axios.post(endpoint, formData, {
        headers: {
          authorization: storedToken,
        },
      });

      toastr.success(response.data?.message || "Done");
      fetchData();
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsModalVisible(false);
      setLoading(false); // Set loading to false when the request is complete
    }
  };
  const toggleArchive = async (id) => {
    if (!isAdmin) {
      toastr.error("Only Admin can do this.");
      return
    }
    const endpoint = `${getBaseUrl()}/toggle-archive/${id}`;
    try {
      toastr.clear();
      setLoading(true);
      const storedToken = localStorage.getItem("token");
      const response = await axios.put(endpoint, {}, {
        headers: {
          authorization: storedToken,
        },
      });

      toastr.success(response.data?.message || "Done");
      fetchData();
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // Set loading to false when the request is complete
    }
  }
  const handleEditModal = async (values)=>{
    if ( values.oldvideoPath ==="" &&  (!values.video || !values.video?.length)) {
      toastr.error("Please Select Video for This Test");
      return;
    }
    // Create a new video object with the provided title and videoFile
    const levelsArrJSON = JSON.stringify(values.levelsArr || []);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("name", values.name);
    formData.append("levelsArr", levelsArrJSON);
    formData.append("totalShots", values.totalShots);
    formData.append("timed", values.timed || 0);
    formData.append("testtype", values.testtype);
    formData.append("includeAttempts", values.includeAttempts || false);
    formData.append("includeDistance", values.includeDistance || false);
    formData.append("includeTime", values.includeTime || false);
    formData.append("isPractice", values.option === "practice");
    formData.append("testId", testId);
    if(values.video && values?.video?.length){
      console.log(")asdkjnvgsdo");
    formData.append("videoFile", values.video[0].originFileObj);}
    formData.append("oldvideoPath", values.oldvideoPath);
    const endpoint = `${getBaseUrl()}/tests`;
    try {
      toastr.clear();
      setLoading(true);
      const storedToken = localStorage.getItem("token");
      const response = await axios.post(endpoint, formData, {
        headers: {
          authorization: storedToken,
        },
      });

      toastr.success(response.data?.message || "Done");
      fetchData();
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsEditModalVisible(false);
      setLoading(false); 
    }
  }
  const tahtstyle = {
    color: "#256208",
    fontFamily: `"Roboto-Bold", Helvetica"`,
    fontSize: "40px",
    fontWeight: 700,
  };
  const deleteVideo = (id) => {
    const storedToken = localStorage.getItem("token");
    const endpoint = `${getBaseUrl()}/tests/${id}`;
    axios
      .delete(endpoint, {
        headers: {
          authorization: storedToken,
        },
      })
      .then((response) => {
        toastr.success(response.data?.message || "TEST REMVOED");
        fetchData();
      })
      .catch((error) => {
        toastr.error(error?.response?.data?.message || "Something went wrong");
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const navigate = useNavigate();
  const GolfOptions = {
    Putting: "Putting",
    Wedges: "Wedges",
    "7IRON": "7 IRON",
    Driver: "Driver",
    sp:"Sam Puttlab",
    SpeedTest: "Speed Test",
    StrengthTraining: "Strength Training",
    Tournaments: "Tournaments",
    tc: "Trackman Combine",
  };
  const [loadPractice, setLoadPractice] = useState(false);
  const changeChallengeHandler = () => {
    setLoadPractice(!loadPractice);
  };
  const handleViewCancel = () => {
    setIsView(false);
  };
  const menu = (
    <Menu>
      <Menu.Item key="view" onClick={() => setIsView(true)}>
        <p>View </p>
      </Menu.Item>

      <Menu.Item key="edit" onClick={() => setIsEditModalVisible(true)} >Edit</Menu.Item>
    </Menu>
  );
  return (
    <div>
      
      <div className="container">
        <div className="row">
          <div className="col-md-12" style={{ marginTop: "30px" }}>
            <span style={tahtstyle} className="player-development">
              PLAYER DEVELOPMENT CHALLENGE
            </span>

            {isAdmin && (
              <BsPlusCircleDotted
                onClick={() => {
                  showModal();
                }}
                className="plus-icon-player-development"
                style={{}}
              />
            )}
            {isAdmin && (
              <AddTestModal
                loading={loading}
                visible={isModalVisible}
                onCreate={handleCreate}
                onCancel={handleCancel}
              />
            )}


            <div
              className="filter-class-practice d-flex"
              style={{ gap: "10px", marginBottom: "10px", marginTop: "10px" }}
            >
              <button
                type="button"
                className={`btn  ${!loadPractice ? "btn-gopal-active btn-dark" : "btn-secondary"
                  }`}
                onClick={changeChallengeHandler}
              >
                Challenge
              </button>
              <button
                type="button"
                className={`btn  ${loadPractice ? "btn-gopal-active btn-dark" : "btn-secondary"
                  }`}
                onClick={changeChallengeHandler}
              >
                Practice
              </button>
            </div>

            <div className="session-card">
              <Row gutter={16} style={{ marginBottom: "10px" }}>
                {data
                  .filter((test) => Boolean(test.isPractice) == loadPractice)
                  .map((test, index) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={8}
                      style={{ display: "flex" }}
                    >
                      <Card
                        actions={[
                          <div
                            key="select"
                            style={{
                              textAlign: "center",
                              color: !test.archived ? "inherit" : "gray",
                              cursor: !test.archived ? "pointer" : "not-allowed",
                            }}
                            onClick={() => {
                              if (test.archived) {
                                return
                              }
                              navigate(`/task/${test._id}`)
                            }}
                          >
                            <RightCircleOutlined
                              style={{ fontSize: 24, color: "green" }}
                            />
                            <div>Start</div>

                          </div>,
                          <>
                            <div
                              key="edit"
                              onClick={() => toggleArchive(test._id)}
                              style={{
                                textAlign: "center",
                                color: isAdmin ? "inherit" : "gray",
                                cursor: isAdmin ? "pointer" : "not-allowed",
                              }}
                            >
                              {!test.archived && <BsArchive style={{ fontSize: 24 }} />}
                              {!test.archived && <div>Archive</div>}
                              {test.archived && <MdRestorePage style={{ fontSize: 24 }} />}
                              {test.archived && <div>Restore</div>}
                            </div>

                          </>,
                          <div
                            key="ellipsis"
                            style={{ textAlign: "center" }}
                            onClick={() => {
                              if (isAdmin) {
                                setTestDbId(test._id);
                                setName(`${test.name} - Clone`);
                                setIsCloneModalVisible(true);
                              } else {
                                navigate("/leader");
                              }
                            }}
                          >
                            {isAdmin ? (
                              <CopyOutlined
                                style={{ fontSize: 24, color: "orange" }}
                              />
                            ) : (
                              <HistoryOutlined
                                style={{ fontSize: 24, color: "orange" }}
                              />
                            )}
                            {isAdmin ? <div>Clone</div> : <div>Score</div>}
                          </div>,
                        ]}
                        title={[
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {test.name}
                            {isAdmin && (
                              <Dropdown overlay={menu} trigger={["click"]}>
                                <svg
                                  onClick={() => setTestId(test._id)}
                                  style={{ fill: "white" }}
                                  height="20px"
                                  preserveAspectRatio="xMidYMid meet"
                                  data-box="44 61 112 78"
                                  viewBox="44 61 112 78"
                                  xmlns="http://www.w3.org/2000/svg"
                                  data-type="shape"
                                  role="img"
                                  aria-label="Main Menu"
                                >
                                  <g>
                                    <path d="M156 61v12H44V61h112z"></path>
                                    <path d="M156 94v12H44V94h112z"></path>
                                    <path d="M156 127v12H44v-12h112z"></path>
                                  </g>
                                </svg>
                              </Dropdown>
                            )}
                          </div>,
                        ]}
                        bordered={true}
                      >
                        <div
                          className="d-flex justify-content-between"
                          style={{ marginBottom: "10px" }}
                        >
                          <span
                            className="badge badge-pill badge-dark p-2"
                            style={{ fontSize: "12px" }}
                          >
                            {GolfOptions[test.testtype]}
                          </span>
                          <span
                            className="badge badge-pill badge-secondary p-2"
                            style={{ fontSize: "12px" }}
                          >
                            Levels {test.levels.length}
                          </span>
                        </div>
                        <p>
                          <b>Instructions</b>
                        </p>
                        <p style={{ wordBreak: "break-all", marginTop: "2px" }}>
                          {test.title}
                        </p>
                        <video
                          controls
                          width="100%"
                          style={{ maxHeight: "300px" }}
                          key={test.videoPath}
                        >
                          <source
                            src={`${getBaseUrl()}/${test.videoPath}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </Card>

                    </Col>
                  ))}
              </Row>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <Spin
          size="large"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <Modal
        visible={isCloneModalVisible}
        title={`Clone Test`}
        onCancel={handleCloneCancel}
        footer={[
          <Button key="cancel" onClick={handleCloneCancel}>
            Cancel
          </Button>,
          <Button key="create" type="primary" onClick={handleClone}>
            Clone
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter new test name"
          value={name}
          onChange={handleNameChange}
        />
      </Modal>
     {testId &&  <EditTestModal
                loading={editloading}
                visible={isEditModalVisible}
                onCreate={handleEditModal}
                onCancel={handleEditCancelModal}
                testId={testId}
              
              />}
                      <Modal
                              visible={isView}
                              title={`Athlete Test`}
                              onCancel={handleViewCancel}
                              footer={[
                                <Button key="cancel" onClick={handleViewCancel}>
                                  Cancel
                                </Button>,
                                <Button
                                  key="create"
                                  type="primary"
                                  onClick={handleViewCancel}
                                >
                                  OK
                                </Button>,
                              ]}
                            >
                              <ViewAthleteTest id={testId}   />
                            </Modal>
      
    </div>
  );
};

export default ReplicateSessionList;
