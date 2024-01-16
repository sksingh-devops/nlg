import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Select, Table, Image } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { AiFillHeart } from "react-icons/ai";
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


const Lead = (props) => {
  const [activeButton, setActiveButton] = useState('leaderboard');
  const [data, setData] = useState([]); // State to store the added videos
  const [rankdata, setrankdata] = useState();
  const [options, setOptions] = useState([]);
  const [dataRaw, setDataRaw] = useState([]);
  const [loadPractice, setLoadPractice] = useState(false);
  const [totalTorun , setTotalT] =useState(5);
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    // Perform any other actions you want when a button is clicked
  };
  const changeChallengeHandler = () => {
    setLoadPractice(!loadPractice)
  }
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
    SpeedTest: "Speed Test",
    StrengthTraining: "Strength Training",
    Tournaments: "Tournaments",
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
  async function fetchDRanked(testType) {
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      let rankUserAPI = `${getBaseUrl()}/ranked-users`;
      if (testType && testType !=="All"){
        rankUserAPI =  `${rankUserAPI}/${testType}` 
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
  async function fetchData() {
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      let userAPI = `${getBaseUrl()}/rank-allathlete`;
      setLoading(true);
      const response = await axios.get(userAPI, {
        headers: {
          authorization: storedToken,
        },
      });
      setData(response.data);
      setDataRaw(response.data);
      setOptions(testOptions);
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
  const columns = [

    {
      title: 'Profile Picture',
      dataIndex: 'userDetails.profilePictureLink',
      key: 'profilePictureLink',
      render: (_,test) => (
        <Image src={
          test.profilePicturePath
            ? `${getBaseUrl()}/${test.profilePicturePath}`
            : test.profilePictureLink
              ? test.profilePictureLink
              : "/image/proImage.png"} alt="Profile" width={50} />
      ),
    },
    {
      title: 'Name',
      dataIndex: ['userDetails', 'name'],
      key: 'name',
      render: (text, record) => {
        return (<Link className="font-weight-bold"
        to={`/profile-ath/${record.userDetails.email}`}
          style={{ textDecoration: 'none', cursor: 'pointer' }}> {text} </Link>)
      }
    },
    {
      title: 'Date Of Birth',
      dataIndex: ['userDetails', 'birthDate'],
      key: 'dob',
      render: (text, record) => {
        return(<span ><span className="font-weight-bold">DOB: </span> {text || "NA"}</span>)
      }
    },
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record) => {
        return(<span ><span className="font-weight-bold">Rank:</span> {text || "NA"}</span>)
      }
    },

    {
      title: 'Average Score',
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (text, record) => {
        return(<span><span className="font-weight-bold">Score:</span> {text || "0"}</span>)
      }
    },
    {
      title: 'Assigned Coach',
      dataIndex: 'assignedCoach.name',
      key: 'assignedCoach',
      render: (assignedCoach, record) => { return (record.assignedCoach?.name ? <Link className="font-weight-bold"
      to={`/profile-ath/${record.assignedCoach.email}`}

        style={{ textDecoration: 'none', cursor: 'pointer' }}><span className="font-weight-bold">Coach: </span> {record.assignedCoach?.name || "NA"} </Link>: <span><span className="font-weight-bold">Coach: </span>NA</span>)
    },
    },
  ];
  useEffect(() => {
    fetchData();
    fetchDRanked();
    fetchTotalT();
  }, []);
  const handleChange = (value) => {
    fetchDRanked(value)
  };
  return (
    <div>
      <Navbar userdata={props.userdata} />
      <div className="leadmainContainer">
        <img className="leadmainImage" src="/image/lead.png" alt="programImg" />
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
            <div className="filter-class-practice d-flex" style={{ gap: '10px', marginBottom: '10px', marginTop: '10px' }}>
              <button type="button" className={`btn  ${!loadPractice ? 'btn-gopal-active btn-dark' : 'btn-secondary'}`} onClick={changeChallengeHandler}>Leaderboard</button>
              <button type="button" className={`btn  ${loadPractice ? 'btn-gopal-active btn-dark' : 'btn-secondary'}`} onClick={changeChallengeHandler}>Challenge</button>
            </div>
            {!loadPractice && <div className="d-flex align-items-center" style={{ justifyContent: "space-between" }}>
              <span style={tahtstyle}>Leaderboard</span>
              
            </div>}
            {loadPractice && <div className="d-flex align-items-center" style={{ justifyContent: "space-between" }}>
              <span className="challenge-view"  style={tahtstyle}>Challenge View</span>
              <Select
                placeholder={<span style={{ fontWeight: 'bold',fontFamily:"sans-serif", color:'black'}}>Select Test Type</span>}
                onChange={handleChange}
                style={{
                  width: 284,
                }}
                options={options}
              />
            </div>}
            {!loadPractice && <div className="session-card">
              <Row gutter={16}>
                {data.map((test, index) => (
                  <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                      cover={
                        <Image
                          style={{
                            maxHeight: "200px",
                            objectFit: "contain",
                          }}
                          alt="example"
                          src={
                            test.profilePicturePath
                              ? `${getBaseUrl()}/${test.profilePicturePath}`
                              : test.profilePictureLink
                                ? test.profilePictureLink
                                : "/image/proImage.png"
                          }
                        />
                      }
                      actions={[
                        <div
                          key="select"
                          onClick={() => navigate(`/profile-ath/${test.email}`)}
                          style={{ textAlign: "center" }}
                        >
                          <ProfileOutlined
                            style={{ fontSize: 24, color: "green" }}
                          />
                          <div>View</div>
                        </div>,
                        <div
                          key="share"
                          onClick={() => navigate(`/profile-ath/${test.email}`)}
                          style={{ textAlign: "center" }}
                        >
                          <AiFillHeart style={{ fontSize: 24, color: "red" }} />
                          <div>Favorite</div>
                        </div>,
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
                      <p>
                        <span className="tt-span">Tournaments:</span>{" "}
                        {test.totalCompletedLevels || "0"}
                      </p>
                      <p>
                        <span className="tt-span">Rank:</span>{" "}
                        {test.rank || "NA"}
                      </p>
                      <p>
                        <span className="tt-span">Overall Score:</span>{" "}
                        {test.totalScores || "NA"}
                      </p>
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
            </div>}
            {loadPractice && <div className="session-card">
              <Table
                columns={columns}
                dataSource={rankdata}
                rowKey={(record) => record.userId}
                showHeader={false}
                pagination={false}
                scroll={{ x: true }}
              />
            </div>}
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
