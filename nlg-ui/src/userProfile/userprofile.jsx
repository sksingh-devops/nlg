import React, { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";

import { useNavigate, useParams } from "react-router";
import { getBaseUrl } from "../config/apiconfig";
import { Modal, Input, Form, Button, Tabs, Select, DatePicker } from "antd";

import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import Academics from "./academics";
import PersonalInfo from "./personalInfo";
import ExtraCuriculms from "./extraCuriculms";
import PersonalRefrences from "./PersonalRefrences";
import ProfileImageCard from "./ProfileImageCard";
import Rankings from "./Rankings";
import HighSchoolPlaying from "./HighSchoolPlaying";
import OtherHonors from "./OtherHonors";
import PointOfContact from "./PointOfContact";
// import TournamentTable from './TournamentTable';
import Footer from "../footer/footer";
import DynamicForm from "./dynamicForm";
const { TabPane } = Tabs;
const baseUrl = getBaseUrl();
let loginEndpoint = `${baseUrl}/user`;
let picEndpoint = `${baseUrl}/pic/user`;
const changePasswordEndpoint = `${baseUrl}/users/updatepass`;
const EditProfileEndpoint = `${baseUrl}/users/update`;
const { RangePicker } = DatePicker;
let isReadOnly = false;
const Userprofile = (props) => {
  

  const onSubmitHandler = (highSchoolPlay) => {
    localStorage.setItem('highSchoolPlay', JSON.stringify(highSchoolPlay));
  };

  const [isPopupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    businessUrl: "",
    linkedurl: "",
    role: "",
    birthDate: "",
    gpa: "",
    graduationDate: "",
    height: "",
    highSchool: "",
    highSchoolPlayingExperience: "",
    homeGolfCourse: "",
    mathematics: "",
    missionHouseVolunteer: "",
    ncaaEligiblityCenter: "",
    otherHonors: [],
    parents: [],
    personalRefrences: [],
    pointOfContact: [],
    reading: "",
    satOverall: "",
    thePlayerStandardBearer: "",
    timTebowTournamentVolunteer: "",
    weight: "",
    writing: "",
    phone: "",
    profilePictureLink: ""
  });
  const { id } = useParams();
  if (id) {
    isReadOnly = true;
    const isRole =
      props.userdata?.role === "admin" ||
      props.userdata?.role === "recruiter" ||
      props.userdata?.role === "coach";

    if (isRole) {
      loginEndpoint = `${baseUrl}/user/${id}`;
      picEndpoint = `${baseUrl}/pic/user/${id}`;
    } else {
      navigate("/login");
    }
  }

  async function fetchData() {
    try {
      toastr.clear();
      let userAPI = loginEndpoint;
      if (id) {
        userAPI = `${baseUrl}/user/${id}`;
      }
      const storedToken = localStorage.getItem("token");
      const response = await axios.get(userAPI, {
        headers: {
          authorization: storedToken,
        },
      });
      const {
        name,
        businessUrl,
        email,
        linkedinProfile,
        role,
        birthDate,
        gpa,
        graduationDate,
        height,
        highSchool,
        highSchoolPlayingExperience,
        homeGolfCourse,
        mathematics,
        missionHouseVolunteer,
        ncaaEligiblityCenter,
        otherHonors,
        parents,
        personalRefrences,
        pointOfContact,
        reading,
        satOverall,
        thePlayerStandardBearer,
        timTebowTournamentVolunteer,
        weight,
        writing,
        highSchoolYearExperience,
        phone,
        profilePictureLink
      } = response.data;
      setData((prevData) => ({
        ...prevData,
        ...{
          name: name,
          businessUrl: businessUrl,
          email: email,
          linkedUrl: linkedinProfile,
          role: role,
          birthDate: birthDate,
          gpa: gpa,
          graduationDate: graduationDate,
          height: height,
          highSchool: highSchool,
          highSchoolPlayingExperience: highSchoolPlayingExperience,
          homeGolfCourse: homeGolfCourse,
          mathematics: mathematics,
          missionHouseVolunteer: missionHouseVolunteer,
          ncaaEligiblityCenter: ncaaEligiblityCenter,
          otherHonors: otherHonors,
          parents: parents,
          personalRefrences: personalRefrences,
          pointOfContact: pointOfContact,
          reading: reading,
          satOverall: satOverall,
          thePlayerStandardBearer: thePlayerStandardBearer,
          timTebowTournamentVolunteer: timTebowTournamentVolunteer,
          weight: weight,
          writing: writing,
          highSchoolYearExperience: highSchoolYearExperience,
          phone: phone,
          profilePictureLink: profilePictureLink
          // profilePicture: profilePicture
        },
      }));
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`User Data Not Found`);
    }
    fetchPic();
  }
  async function fetchPic() {
    const storedToken = localStorage.getItem("token");
    const response = await axios.get(picEndpoint, {
      headers: {
        authorization: storedToken,
      },
    });
    const { profilePicture } = response.data;

    setData((prevData) => ({ ...prevData, profilePicture: profilePicture }));
  }
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {

    console.log(data.name);
  }, [data]);

  const dashboardHandler = () => {
    if (props.userdata?.role === "admin") {
      navigate("/invite");
    } else if (props.userdata?.role === "athlete") {
      navigate("/profile-ath");
    }
    // TODO GOPAL What is this code ?
    else if (props.userdata?.role === "recruiter") {
      navigate("/collegedashboard");
    }
  };
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const openPopup = () => {
    setPopupVisible(true);
  };
  
  const openEditPopup = () => {
    setIsEditPopupVisible(true);
  };
  const closePopup = () => {
    setPopupVisible(false);
  };
  const isEditClosePopup = () => {
    setIsEditPopupVisible(false);
  };
  const onFinish = (values) => {
    console.log(values.password);
    changepassword(values.password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const dateConverter = (values) => {
    const dateRange = values;
    if (Array.isArray(dateRange) && dateRange.length === 2) {

      const startDate = dateRange[0].toISOString().split("T")[0];
      const endDate = dateRange[1].toISOString().split("T")[0];
      values = [startDate, endDate];
      return values;

    } else {
      return null;
    }
  }
  const onEditFinish = (values) => {
    const highSchoolPlay = JSON.parse(localStorage.getItem('highSchoolPlay'));

    localStorage.setItem("name", values.name);
   
    editProfile(
      values.name,
      values.businessUrl,
      values.linkedUrl,
      values.birthDate,
      values.gpa,
      values.graduationDate,
      values.height,
      values.highSchool,
      highSchoolPlay,
      values.homeGolfCourse,
      values.mathematics,
      values.missionHouseVolunteer,
      values.ncaaEligiblityCenter,
      values.otherHonors,
      values.parents,
      values.personalRefrences,
      values.pointOfContact,
      values.reading,
      values.satOverall,
      values.thePlayerStandardBearer,
      values.timTebowTournamentVolunteer,
      values.weight,
      values.writing,
      
      values.phone
    );
  };
  const onEditFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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

  const editProfile = async (
    name,
    businessUrl,
    linkedinProfile,
    birthDate,
    gpa,
    graduationDate,
    height,
    highSchool,
    highSchoolPlay,
    homeGolfCourse,
    mathematics,
    missionHouseVolunteer,
    ncaaEligiblityCenter,
    otherHonors,
    parents,
    personalRefrences,
    pointOfContact,
    reading,
    satOverall,
    thePlayerStandardBearer,
    timTebowTournamentVolunteer,
    weight,
    writing,
    
    phone
  ) => {

    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      const response = await axios.post(
        EditProfileEndpoint,
        {
          name,
          businessUrl,
          linkedinProfile,
          birthDate,
          gpa,
          graduationDate,
          height,
          highSchool,
          highSchoolPlay,
          homeGolfCourse,
          mathematics,
          missionHouseVolunteer,
          ncaaEligiblityCenter,
          otherHonors,
          parents,
          personalRefrences,
          pointOfContact,
          reading,
          satOverall,
          thePlayerStandardBearer,
          timTebowTournamentVolunteer,
          weight,
          writing,
          phone
        },
        {
          headers: {
            authorization: storedToken,
          },
        }
      );

      toastr.success(response.data?.message || "Done");
      setIsEditPopupVisible(false);
      fetchData();
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
  return (
    <div style={{ width: "100%" }}>
      <section style={{ backgroundColor: "#eee", width: "100%" }}>
        <div>
          <div className="row">
            <div className="col">
              <Navbar userdata={props.userdata} />
            </div>
          </div>

          <div
            className="row"
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >

            <div className="col-lg-5">
              <h3
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  fontFamily: "-webkit-body",
                  fontSize: "-webkit-xxx-large",
                }}
              >
                {data?.name}
              </h3>
              <p
                className="text-center text-decoration-underline"
                style={{ color: "blue" }}
              >
                {data.email}
              </p>
              <PersonalInfo data={data} />

              {!isReadOnly && (
                <div className="d-flex justify-content-center mb-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      marginRight: "10px",
                      backgroundColor: "black",
                      color: "greenyellow",
                      border: "none",
                    }}
                    onClick={openEditPopup}
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      marginRight: "10px",
                      backgroundColor: "black",
                      color: "greenyellow",
                      border: "none",
                    }}
                    onClick={dashboardHandler}
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      marginRight: "10px",
                      backgroundColor: "black",
                      color: "greenyellow",
                      border: "none",
                    }}
                    onClick={openPopup}
                  >
                    Change Password
                  </button>
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

              <Modal
                title="Edit Your Profile"
                visible={isEditPopupVisible}
                onCancel={isEditClosePopup}
                footer={null}
                titleProps={{
                  style: { color: "red" },
                }}
                width={800}
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
                    marginTop: "20px",
                  }}
                  initialValues={data}
                  onFinish={onEditFinish}
                  onFinishFailed={onEditFinishFailed}
                  autoComplete="off"
                >
                  <Tabs tabPosition="left">
                    <TabPane tab="Personal Information" key="1">
                      <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Name cannot be blank",
                          },
                        ]}
                        labelAlign="top"
                      >
                        <Input defaultValue={data?.name} />
                      </Form.Item>
                      <Form.Item
                        label="Phone"
                        name="phone"
                        labelAlign="top"
                      >
                        <Input defaultValue={data?.phone} />
                      </Form.Item>
                      <Form.Item
                        label="Business_URL"
                        name="businessUrl"
                        rules={[
                          {
                            required: false,
                            message: "BusinessUrl cannot be blank",
                          },
                        ]}
                        labelAlign="top"
                      >
                        <Input defaultValue={data.businessUrl} />
                      </Form.Item>
                      <Form.Item
                        label="LinkedIn_URL"
                        name="linkedUrl"
                        rules={[
                          {
                            required: false,
                            message: "LinkedIn cannot be blank",
                          },
                        ]}
                        labelAlign="top"
                      >
                        <Input defaultValue={data.linkedUrl} />
                      </Form.Item>
                      <Form.Item
                        label="Birth Date"
                        name="birthDate"
                        labelAlign="top"
                      >
                        <Input
                          defaultValue={data.birthDate}
                          placeholder="Birth Date"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Graduation Date"
                        name="graduationDate"
                        labelAlign="top"
                      >
                        <Input
                          defaultValue={data.graduationDate}
                          placeholder="Gradutaion Date"
                        />
                      </Form.Item>
                      <Form.Item label="Height" name="height" labelAlign="top">
                        <Input
                          defaultValue={data.height}
                          placeholder="Height"
                        />
                      </Form.Item>
                      <Form.Item label="Weight" name="weight" labelAlign="top">
                        <Input
                          defaultValue={data.weight}
                          placeholder="Weight"
                        />
                      </Form.Item>
                    </TabPane>
                    
                  </Tabs>

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
                        marginTop: "20px",
                        fontSize: "20px",
                      }}
                    >
                      Update Your Profile
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
            <div className="col-lg-4">
              <ProfileImageCard data={data} />
            </div>
          </div>

          {/* table */}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Userprofile;
