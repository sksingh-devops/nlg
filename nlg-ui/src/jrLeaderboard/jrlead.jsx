import React, { useEffect, useState } from "react";
import { Card, Row, Col, Dropdown, Menu, Select, Table, Image, Collapse } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { AiFillHeart } from "react-icons/ai";
import { MdOutlineAssignment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import toastr from "toastr";
import { Link } from "react-router-dom";
import axios from "axios";
import "./jrlead.css";
import { getBaseUrl } from "../config/apiconfig";
import "toastr/build/toastr.min.css";
import { Empty, Spin } from "antd";
import Avatar from "react-avatar";
const { Panel } = Collapse;
const JRLeader = (props) => {
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
  };
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
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthdateArray = birthdate?.split("/");

    if (birthdateArray?.length !== 3) {
      // Handle invalid birthdate format
      console.error("Invalid birthdate format:", birthdate);
      return -1; // or handle it in a way that makes sense for your application
    }

    const birthYear = parseInt(birthdateArray[2], 10);
    const birthMonth = parseInt(birthdateArray[0], 10) - 1;
    const birthDay = parseInt(birthdateArray[1], 10);

    const age = today.getFullYear() - birthYear;

    if (
      today.getMonth() < birthMonth ||
      (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
      return age - 1;
    }

    return age;
  };

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
      console.log(response.data);

      const filteredData = response.data.filter((item) => {
        const age = calculateAge(item.userDetails.birthDate);
        return age < 18;
      });

      console.log();
      setrankdata(filteredData);
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
      let userAPI = `${getBaseUrl()}/jruser-scores`;
      setLoading(true);
      const response = await axios.get(userAPI, {
        headers: {
          authorization: storedToken,
        },
      });
      console.log(response.data);
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
    Assigntest(userid);
  }
  async function Assigntest(userId) {
    try {
      const storedToken = localStorage.getItem("token");
      const Endpoint = `${getBaseUrl()}/assign-multi-test/${userId}`;
      const response = await axios.post(
        Endpoint,
        {},
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
        return test?.userDetails?.profilePicturePath ||
          test?.userDetails?.profilePictureLink ? (
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
            {test?.userDetails?.name?.charAt(0) ||
              test?.userDetails?.email?.charAt(0)}
          </div>
        );
      },
    },
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
            <span className="font-weight-bold">Levels:</span>{" "}
            {typeof text === "number" ? text : "1"}
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
            </Link>
          </>
        ) : (
          <span>
            <span className="font-weight-bold">Coach: </span>NA
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
            <span>JR LEADERBOARD</span>
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
            <p className="display-4 font-weight-bold">{data?.length || 0}</p>
            <p className="h5">TOTAL PLAYERS</p>
            <p className="font-weight-light">
              Record of all the players with name and performance
            </p>
          </div>
          <div
            className="col-md-2 col-sm-12 offset-md-1 offset-sm-0 text-center text-black"
            style={{ backgroundColor: "#FFF", borderRadius: "20px" }}
          >
            <p className="display-4 font-weight-bold">1</p>
            <p className="h5">TOTAL CHALLENGES</p>
            <p className="font-weight-light">
              No. of challenges played by each player including average score
            </p>
          </div>
        </div>
        </div>
  
      <Row gutter={16} style={{  width:"80%" ,minHeight:"50vh", justifyContent:"center",display:"flex" , flexWrap:"wrap" , paddingTop:"30px" , paddingBottom:"30px" }} >

        {data.map((data, index)=>(
        <Col xs={24} sm={12} md={8} lg={8} xl={8} style={{display:"flex", flexDirection:"column", justifyContent:"center"}}><Card cover={
                         (!data?.userId?.profilePicturePath)  ? ( <div
                          style={{  
                            display:"flex",
                           alignItems:"center",
                           justifyContent:"center",
                           
                          }} ><div
                          
                            style={{  
                              display:"flex",
                              justifyContent:"center",
                            
                              width: "70%",
                              height: "200px",
                              objectFit: "contain",
                              backgroundColor: "orange",
                              textAlign: "center",
                              alignItems:"center",
                              fontSize: "100px",
                              color: "white",
                            }}
                            
                          > {data?.userId?.name ? data?.userId?.name?.charAt(0):data?.userId?.email?.charAt(0)}</div></div>):(
                            <Image  style={{
                              maxHeight: "200px",
                              objectFit: "contain",
                            }}
                            alt="example"
                            src={
                              
                                 `${getBaseUrl()}/${data?.userId?.profilePicturePath}`
                                
                                 
                            } />
                          )
                        }  style={{minHeight:"55vh",height:"auto", width:"400px", boxShadow:"0 0 20px 10px rgba(0, 0, 0, 0.5)"}}>
          
          <p style={{fontSize:"18px"}}
          ><span style={{fontWeight:"bold"}}>Name : </span> {data?.userId?.name}</p>
          <p style={{fontSize:"18px"}}><span style={{fontWeight:"bold"}}>Email : </span>{data?.userId?.email}</p>
          <Row style={{ display:"flex", flexDirection:"column"}}>
          <Collapse accordion >
          {data.holeScore.map((hole, index)=>(
           <Panel    header={`Hole ${index + 1}`} style={{display:"flex" ,flexDirection:"column", gap:"5px"}}>
                <p><span style={{fontWeight:"bold"}}> Score : </span> {hole.score}</p>
                <p><span style={{fontWeight:"bold"}}> Par :</span> {hole.par}</p>
                <p><span style={{fontWeight:"bold"}}> Fairway Hit : </span> {hole.fairway_hit}</p>
                <p><span style={{fontWeight:"bold"}}>Carry Distance : </span> {hole.carry_distance}</p>
                <p><span style={{fontWeight:"bold"}}> GIR : </span> {hole.gir}</p>
                <p><span style={{fontWeight:"bold"}}> Correct Leave : </span> {hole.correct_leave}</p>

            </Panel>
          ))}
          </Collapse>
          </Row>
        </Card>
        </Col>))}
        </Row>
    
      <Footer />
    </div>
  );
};

export default JRLeader;

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
