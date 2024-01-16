import React, { useEffect, useState } from "react";
import { Card, Row, Col, Dropdown,Menu, Select, Table, Image } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { AiFillHeart } from "react-icons/ai";
import { MdOutlineAssignment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import toastr from "toastr";
import { Link } from "react-router-dom";
import axios from "axios";
import "./lead.css";
import { getBaseUrl } from "../config/apiconfig";
import "toastr/build/toastr.min.css";
import { Empty, Spin } from "antd";
import Avatar from "react-avatar";

const Lead = (props) => {
  const [activeButton, setActiveButton] = useState("leaderboard");
  const [data, setData] = useState([]);
  const [selectedTest, setSelectedTest] = useState("All"); // Initially set to "All"
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedUserID, setSelectedUserID] = useState("All");
  const [drowdownTest, setDrowdownTest] = useState([]);
  const [drowdownLevel, setDrowdownLevel] = useState([]);
  const [drowndownuser, setDrowndownuser] = useState([]);
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";
  const [testData, setTestData] = useState([]);
  const [filterRank, setFilterRank] = useState([]);
  const handleTestChange = (value) => {
    setSelectedTest(value);
    if (value !== "All") {
      const selectedTestObject = testData.find((test) => test._id === value);
      const levelOptions = selectedTestObject
        ? [
          { value: "All", label: "All" },
          ...selectedTestObject.levels.map((level, index) => ({
            value: level._id,
            label: `Level ${index + 1}`, // Generate level numbers
          })),
        ]
        : [{ value: "All", label: "All" }];
      setDrowdownLevel(levelOptions);
      setSelectedLevel("All");
    }
  };
  const handleLevelChange = (value) => {
    setSelectedLevel(value);
  };
  const handleUserChange = (value) => {
    setSelectedUserID(value);
  };
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    // Perform any other actions you want when a button is clicked
  };
  const [rankdata, setrankdata] = useState();
  const [options, setOptions] = useState([]);
  const [dataRaw, setDataRaw] = useState([]);
  //const [loadPractice, setLoadPractice] = useState(false);
  const [totalTorun, setTotalT] = useState(5);
  // const changeChallengeHandler = () => {
  //   setLoadPractice(!loadPractice)
  // }
  const tahtstyle = {
    color: "#256208",
    fontFamily: `"Roboto-Bold", Helvetica"`,
    fontSize: "40px",
    fontWeight: 700,
  };

  const GolfOptions = {
    All: "All",
    Putting: "Putting",
    Wedges: "Wedges",
    "7IRON": "7 IRON",
    Driver: "Driver",
    sp: "Sam Puttlab",
    SpeedTest: "Speed Test",
    StrengthTraining: "Strength Training",
    Tournaments: "Tournaments",
    tc: "Trackman Combine",
  };

  const assignMenu = (test) => {
    return (
    <Menu>
      <Menu.Item key="assignAll" onClick={() => assignTest(test._id)}>
        All Challenges
      </Menu.Item>
      <Menu.Item key="assignSpecific">
        <Link to={`/session`}>Specific Challenge/Practice</Link>
      </Menu.Item>
    </Menu>
  );
    }
  const testOptions = Object.keys(GolfOptions).map((key) => ({
    label: GolfOptions[key],
    value: key,
  }));

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function fetchTotalT() {
    try {
      toastr.clear();

      let rankUserAPI = `${getBaseUrl()}/count-tests`;

      const response = await axios.get(rankUserAPI);
      setTotalT(response.data.count);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchDRanked(testType) {
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      let rankUserAPI = `${getBaseUrl()}/gopalsampleranked-users`;
      if (testType && testType !== "All") {
        rankUserAPI = `${rankUserAPI}/${testType}`;
      }
      setLoading(true);
      const response = await axios.get(rankUserAPI, {
        headers: {
          authorization: storedToken,
        },
      });
      setrankdata(response.data);
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`User Data Not Found`);
    } finally {
      setLoading(false);
    }
  }

  async function fetchGORanked(testType) {
    try {
      toastr.clear();
      const queryParams = {};

      if (selectedTest !== "All") {
        queryParams.testId = selectedTest;
      }

      if (selectedLevel !== "All") {
        queryParams.levelwId = selectedLevel;
      }

      if (selectedUserID !== "All") {
        queryParams.userId = selectedUserID;
      }

      // Convert queryParams object to query string
      const queryString = new URLSearchParams(queryParams).toString();

      // Make the API call with the constructed query string
      const apiUrl = `gopalranked-users-by-test?${queryString}`;
      const storedToken = localStorage.getItem("token");
      let rankUserAPI = `${getBaseUrl()}/${apiUrl}`;
      setLoading(true);
      const response = await axios.get(rankUserAPI, {
        headers: {
          authorization: storedToken,
        },
      });
      setFilterRank(response.data);
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`User Data Not Found`);
    } finally {
      setLoading(false);
    }
  }

  async function fetchData() {
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      let userAPI = `${getBaseUrl()}/gopalrank-allathlete`;
      setLoading(true);
      const response = await axios.get(userAPI, {
        headers: {
          authorization: storedToken,
        },
      });
      setData(response.data);
      setDataRaw(response.data);
      setOptions(testOptions);
      const userOptions = [
        { value: "All", label: "All" },
        ...response.data?.map((user) => ({
          value: user._id,
          label: user?.name?.trim() || user.email,
        })),
      ];
      setDrowndownuser(userOptions);
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`User Data Not Found`);
    } finally {
      setLoading(false);
    }
  }
  const loadAthletsnow = () => {
    fetchGORanked();
  };
  const resetFiler = () => {
    setSelectedTest("All"); // Initially set to "All"
    setSelectedLevel("All");
    setSelectedUserID("All");
    setTimeout(() => {
      fetchGORanked();
    }, 10);
  };
  async function assignTest(userid) {
    Assigntest(userid)
  }
  async function Assigntest(userId) {
    try {
      const storedToken = localStorage.getItem("token");
      const Endpoint = `${getBaseUrl()}/assign-multi-test/${userId}`;
      const response = await axios.post(
        Endpoint,
        {  },
        {
          headers: {
            authorization: storedToken,
          },
        }
      );
      toastr.success("Active Challenges assigned successfully");
      

    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error?.response?.data?.message || "Something went wrong");
    }
  }
  async function fetchTestData() {
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      let userAPI = `${getBaseUrl()}/testsPub`;
      setLoading(true);
      const response = await axios.get(userAPI, {
        headers: {
          authorization: storedToken,
        },
      });
      setTestData(response.data);
      const testOptions1 = [
        { value: "All", label: "All" },
        ...response.data?.map((test) => ({
          value: test._id,
          label: test.name,
        })),
      ];
      setDrowdownTest(testOptions1);
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

  const columns = [
    {
      title: "Profile Picture",
      dataIndex: "userDetails.profilePictureLink",
      key: "profilePictureLink",
      render: (_, test) => {
        return (
          (test?.userDetails?.profilePicturePath || test?.userDetails?.profilePictureLink) ? (
            <Image
              src={
                test?.userDetails?.profilePicturePath
                  ? `${getBaseUrl()}/${test?.userDetails?.profilePicturePath}`
                  : test?.userDetails?.profilePictureLink
              }
              alt="Profile"
              width={50}
            />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                
                width: "50px",
                height: "50px",
                objectFit: "contain",
                backgroundColor: "orange",
                textAlign: "center",
                alignItems: "center",
                fontSize: "20px",
                color: "white",
              }}
            >
              {test?.userDetails?.name?.charAt(0) || test?.userDetails?.email?.charAt(0)}
            </div>
          )
        );
            }},
    {
      title: "Name",
      dataIndex: ["userDetails", "name"],
      key: "name",
      render: (text, record) => {
        return (
          <Link
            className="font-weight-bold"
            to={`/profile-ath/${record.userDetails.email}`}
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            {" "}
            {text}{" "}
          </Link>
        );
      },
    },
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render: (text, record) => {
        return (
          <span>
            <span className="font-weight-bold">Rank:</span> {text || "NA"}
          </span>
        );
      },
    },

    {
      title: "Average Score",
      dataIndex: ["userDetails", "totalCompletedLevels"],
      key: "totalCompletedLevels",
      render: (text, record) => {
        return (
          <span>
            <span className="font-weight-bold">Levels:</span>  {typeof text === 'number'
              ? text
              : "1"}
          </span>
        );
      },
    },
    {
      title: "Assigned Coach",
      dataIndex: "assignedCoach.name",
      key: "assignedCoach",
      render: (assignedCoach, record) => {
        return record.assignedCoach?.name ? (
          <>
            <span className="font-weight-bold">Coach: </span>
            <Link
              className="font-weight-bold"
              to={`/profile-ath/${record.assignedCoach.email}`}
              style={{ textDecoration: "none", cursor: "pointer" }}
            >
              {record.assignedCoach?.name || "NA"}
            </Link></>
        ) : (
          <span>
            <span className="font-weight-bold">Coach:{" "}</span>NA
          </span>
        );
      },
    },
  ];
  useEffect(() => {
    fetchData();
    fetchDRanked();
    fetchTotalT();
    fetchTestData();
  }, []);
  const handleChange = (value) => {
    fetchDRanked(value);
  };
  return (
    <div>
      <Navbar userdata={props.userdata} />
      <div className="leadmainContainer">
        <img className="leadmainImage" src="/image/leaderboard.jpeg" alt="programImg" />
        <div className="leadoverFlowContainer">
          <h1>
            {" "}
            <span>LEADERBOARD</span>
          </h1>
          <div>
            <p>
              <span style={{ textShadow: "0 0 10px rgba(0, 0, 0, 0.7)" }}>
                Different Players data including all the performance details.
              </span>
            </p>
          </div>
        </div>
      </div>
      <div
        className=""
        style={{
          backgroundColor: "#424141",
          padding: "30px 0px",
          width: "100%",
          overflow: "hidden",
          marginTop: "-2px",
        }}
      >
        <div className="row justify-content-center">
          <div
            className="col-md-2 col-sm-12 text-center text-black"
            style={{ backgroundColor: "#FFF", borderRadius: "20px" }}
          >
            <p className="display-4 font-weight-bold">{data?.length || 75}</p>
            <p className="h5">TOTAL PLAYERS</p>
            <p className="font-weight-light">
              Record of all the players with name and performance
            </p>
          </div>
          <div
            className="col-md-2 col-sm-12 offset-md-1 offset-sm-0 text-center text-black"
            style={{ backgroundColor: "#FFF", borderRadius: "20px" }}
          >
            <p className="display-4 font-weight-bold">{totalTorun}</p>
            <p className="h5">TOTAL CHALLENGES</p>
            <p className="font-weight-light">
              No. of challenges played by each player including average score
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div
              className="filter-class-practice d-flex"
              style={{ gap: "10px", marginBottom: "10px", marginTop: "10px" }}
            >
              <button
                type="button"
                className={`btn ${activeButton === "leaderboard"
                  ? "btn-gopal-active btn-dark"
                  : "btn-secondary"
                  }`}
                onClick={() => handleButtonClick("leaderboard")}
              >
                Leaderboard
              </button>
              <button
                type="button"
                className={`btn ${activeButton === "challenge"
                  ? "btn-gopal-active btn-dark"
                  : "btn-secondary"
                  }`}
                onClick={() => handleButtonClick("challenge")}
              >
                Challenge
              </button>
              <button
                type="button"
                className={`btn ${activeButton === "yourButton"
                  ? "btn-gopal-active btn-dark"
                  : "btn-secondary"
                  }`}
                onClick={() => handleButtonClick("yourButton")}
              >
                Challenge Search
              </button>
            </div>
            {activeButton === "leaderboard" && (
              <div
                className="d-flex align-items-center"
                style={{ justifyContent: "space-between" }}
              >
                <span style={tahtstyle}>Leaderboard</span>
              </div>
            )}
            {activeButton === "challenge" && (
              <div
                className="d-flex align-items-center"
                style={{ justifyContent: "space-between" }}
              >
                <span className="challenge-view" style={tahtstyle}>
                  Challenge View
                </span>
                <Select
                  placeholder={
                    <span
                      style={{
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        color: "black",
                      }}
                    >
                      Select Test Type
                    </span>
                  }
                  onChange={handleChange}
                  style={{
                    width: 284,
                  }}
                  options={options}
                />
              </div>
            )}
            {activeButton === "yourButton" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <div
                  className="d-flex align-items-center"
                  style={{ justifyContent: "space-between" }}
                >
                  <span className="challenge-view" style={tahtstyle}>
                    {" "}
                    Test View
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexWrap: 'wrap', flexDirection: "row", gap: "25px" }}
                >
                  <div>
                    <label
                      style={{
                        display: "inline",
                        fontWeight: "bold",
                        marginRight: "10px",
                      }}
                    >
                      Test
                    </label>
                    <Select
                      placeholder={
                        <span
                          style={{
                            fontWeight: "bold",
                            fontFamily: "sans-serif",
                            color: "black",
                          }}
                        >
                          Select Test
                        </span>
                      }
                      onChange={handleTestChange}
                      style={{
                        width: 284,
                      }}
                      value={selectedTest}
                      options={drowdownTest}
                    />
                  </div>
                  {/* {<><label>Level</label><Select
                placeholder={<span style={{ fontWeight: 'bold', fontFamily: "sans-serif", color: 'black' }}>Select Level</span>}
                onChange={handleLevelChange}
                style={{
                  width: 284,
                }}
                disabled={selectedTest === "All"}
                options={drowdownLevel}
                value={selectedLevel} 
              /></>} */}
                  {
                    <div>
                      <label
                        style={{
                          display: "inline",
                          fontWeight: "bold",
                          marginRight: "10px",
                        }}
                      >
                        User
                      </label>
                      <Select
                        placeholder={
                          <span
                            style={{
                              fontWeight: "bold",
                              fontFamily: "sans-serif",
                              color: "black",
                            }}
                          >
                            Select User
                          </span>
                        }
                        onChange={handleUserChange}
                        style={{
                          width: 284,
                        }}
                        value={selectedUserID}
                        options={drowndownuser}
                      />
                    </div>
                  }
                </div>
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "15px", marginBottom: "10px" }}
                >
                  <button
                    onClick={() => {
                      loadAthletsnow();
                    }}
                    type="button"
                    class="btn btn-primary"
                  >
                    Load Athlete
                  </button>
                  <button
                    onClick={() => {
                      resetFiler();
                    }}
                    type="button"
                    class="btn btn-default"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
            {activeButton === "leaderboard" && (
              <div className="session-card">
                <Row gutter={16}>
                  {data.map((test, index) => (
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                      <Card
                        cover={
                         (!test.profilePictureLink&&!test.profilePicturePath)  ? ( <div
                          style={{  
                            display:"flex",
                           alignItems:"center",
                           justifyContent:"center",
                           
                          }} ><div
                          
                            style={{  
                              display:"flex",
                              justifyContent:"center",
                            
                              width: "60%",
                              height: "200px",
                              objectFit: "contain",
                              backgroundColor: "orange",
                              textAlign: "center",
                              alignItems:"center",
                              fontSize: "100px",
                              color: "white",
                            }}
                            
                          > {test.name? test?.name?.charAt(0):test?.email?.charAt(0)}</div></div>):(
                            <Image  style={{
                              maxHeight: "200px",
                              objectFit: "contain",
                            }}
                            alt="example"
                            src={
                              test.profilePicturePath
                                ? `${getBaseUrl()}/${test.profilePicturePath}`
                                : test.profilePictureLink
                                 
                            } />
                          )
                        }
                        actions={[
                          <div
                            key="select"
                            onClick={() =>
                              navigate(`/profile-ath/${test.email}`)
                            }
                            style={{ textAlign: "center" }}
                          >
                            <ProfileOutlined
                              style={{ fontSize: 24, color: "green" }}
                            />
                            <div>View</div>
                          </div>,
                          isAdmin ? (<Dropdown overlay={() => assignMenu(test)} key="assign">
                          <div style={{ textAlign: "center" }}>
                            <MdOutlineAssignment style={{ fontSize: 24, color: "black" }} />
                            <div>Assign Challenges</div>
                          </div>
                        </Dropdown>) : <div
                            key="share"
                            onClick={() =>
                              navigate(`/profile-ath/${test.email}`)
                            }
                            style={{ textAlign: "center" }}
                          >
                            <AiFillHeart
                              style={{ fontSize: 24, color: "red" }}
                            />
                            <div>Favorite</div>
                          </div>
                        ]}
                        title={test.name}
                        bordered={true}
                      >
                        {/* <p><b>Instructions</b></p>
                        <p>{test.title}</p> */}
                        {/* <video controls width="100%" style={{ maxHeight: "300px" }}>
                          <source src={`${getBaseUrl()}/${test.videoPath}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video> */}
                        {/* <p>
                          <span className="tt-span">Rank:</span>{" "}
                          {test.rank || "NA"}
                        </p> */}
                        <p>
                          <span className="tt-span">Levels Completed:</span>{" "}
                          {test.totalCompletedLevels || "0"}
                        </p>
                        {/* <p>
                          <span className="tt-span">Overall Score:</span>{" "}
                          {typeof test.totalScores === "number"
                            ? test.totalScores.toFixed(2)
                            : "NA"}
                        </p> */}
                        <p>
                          <span className="tt-span">Coach:</span>{" "}
                          <span
                            className={test.cocah?.name ? "coach-here" : ""}
                            onClick={() => {
                              if (test.cocah?.name) {
                                navigate(`/profile-ath/${test.cocah?.email}`);
                              }
                            }}
                          >
                            {test.cocah?.name || "NA"}
                          </span>
                        </p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
            {activeButton === "challenge" && (
              <div className="session-card">
                <Table
                  columns={columns}
                  dataSource={rankdata}
                  rowKey={(record) => record._id}
                  showHeader={false}
                  pagination={false}
                  scroll={{ x: true }}
                />
              </div>
            )}
            {activeButton === "yourButton" && (
              <div className="session-card">
                <Table
                  columns={columns}
                  dataSource={filterRank}
                  rowKey={(record) => record._id}
                  showHeader={false}
                  pagination={false}
                  scroll={{ x: true }}
                />
              </div>
            )}
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
      <Footer />
    </div>
  );
};

export default Lead;

// actions={[
//     <div key="select" onClick={() => navigate(`/aprofile/${test.email}`)} style={{ textAlign: 'center' }}>
//         <ProfileOutlined style={{ fontSize: 24, color: 'green' }} />
//         <div>View</div>
//     </div>,
//     <div key="share" onClick={() => navigate(`/aprofile/${test.email}`)} style={{ textAlign: 'center' }}>
//         <BiShare style={{ fontSize: 24, color: 'orange' }} />
//         <div>Share</div>
//     </div>,
// ]}
