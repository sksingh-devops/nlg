import React, { useState, useEffect } from "react";
import "./style.css";
import Navbar from "../navbar/navbar";
import CoverPhoto from "./coverphoto";
import SocialBox from "./social";
import VideoPlayer from './videoplayer'
import Bio from './bio'
import Footer from "../footer/footer";
import References from './references'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Modal, Input, Form, Button, Select } from "antd";
import toastr from "toastr";
import axios from "axios";
import { getBaseUrl } from "../config/apiconfig";
import "toastr/build/toastr.min.css";
import { useNavigate, useParams } from "react-router";
import PlayingExp from "./playingexp"
import { Tabs } from "antd";
import PlayerPerformance from "./playerPerformance";
const { TabPane } = Tabs;
const ProfileDefault = (props) => {
  const {bio,ref} = props
  const [data, setData] = useState({})
  const [bioContent, setBioContent] = useState(bio || '');
  const [refContent, setRefContent] = useState(ref|| '');
  var isReadOnly = true;
  let email = localStorage.getItem("email")
  let { id } = useParams();
  const navigate = useNavigate();
  if (!id) {
    if (!email) {
      navigate('/')
    } else {
      isReadOnly = false
    }
  }else{
    email = id 
  }
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }],
      ['link'],
      ["clean"],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "color",
    'link',
  ];
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);

  const openEditPopup = () => {
    setIsEditPopupVisible(true);
  };


  const isEditClosePopup = () => {
    setIsEditPopupVisible(false);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  async function fetchData() {
    try {
      toastr.clear();
      let userAPI = `${getBaseUrl()}/nprofile/${email}`;
      const response = await axios.get(userAPI, {
      });
      setData(response.data);
      setBioContent(response?.data?.bio)
      setRefContent(response?.data?.ref)
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
  }
  const onEditFinish = (values) => {
    console.log(values)
    const formData = {
      ...values,
      bio: bioContent,
      ref : refContent,
    };
    editProfile(formData)
  }
  const editProfile = async (val) => {
   const  editProfileEndpoint = `${getBaseUrl()}/nprofile/updateUser`;
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      const response = await axios.post(editProfileEndpoint,
        val,
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
  }
  const oneditcilck = async () => {
    openEditPopup()
  }
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setBioContent(bio)
  }, [bio]);
  useEffect(() => {
    setRefContent(ref)
  }, [ref]);


  return (
    <div>
      <Navbar userdata={props.userdata} />
      <div className="profile-default">
        <CoverPhoto isReadOnly={isReadOnly} coverImage={data.coverPicturePath} into={data} profileImage={data.profilePicturePath} backupimg={data.profilePictureLink}/>
        <SocialBox isReadOnly={isReadOnly} oneditcilck={oneditcilck} into={data} />
        <Tabs
          defaultActiveKey="1"
          centered
        >
          <TabPane tab={<div className="profile-tab">BIO</div>} key="1">
            <Bio content={data.bio || data.name} />
          </TabPane>
          <TabPane tab={<div className="profile-tab">PLAYING EXPERIENCE</div>} key="2">
            <PlayingExp isReadOnly={isReadOnly} email={email}/>
          </TabPane>
          <TabPane tab={<div className="profile-tab">NLG RESULTS</div>} key="3">
            <PlayerPerformance isReadOnly={isReadOnly} email={email} name={data.name}/>
            
          </TabPane>
          <TabPane tab={<div className="profile-tab">VIDEOS</div>} key="4">
            <div style={{
              marginTop: "10px"
            }}>
              <VideoPlayer isReadOnly={isReadOnly} email={email} />
            </div>
          </TabPane>
          <TabPane tab={<div className="profile-tab">REFERERENCES</div>} key="5">
            <References content={data.ref || data.name}></References>
          </TabPane>
        </Tabs>
      </div>
      <Modal
        title="Edit Your Profile"
        visible={isEditPopupVisible}
        onCancel={isEditClosePopup}
        footer={null}
        titleProps={{
          style: { color: "red" },
        }}
        width={800}
        className="ath-modal"
        style={{ maxWidth: "100%" }}
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
          autoComplete="off"
        >
          <Tabs tabPosition="left">
            <TabPane tab="Player Information" key="1">
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
                label="Social"
                name="social"
                labelAlign="top"
              >
                <Input defaultValue={data.social} />
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
              <Form.Item label="Height" name="height" labelAlign="top">
                <Input
                  defaultValue={data.height}
                  placeholder="Height"
                />
              </Form.Item>
              <Form.Item label="Swing" name="swing" labelAlign="top">
                <Input
                  defaultValue={data.swing}
                  placeholder="SWING"
                />
              </Form.Item>
              <Form.Item label="LOW ROUND" name="lr" labelAlign="top">
                <Input
                  defaultValue={data.lr}
                  placeholder="LOW ROUND"
                />
              </Form.Item>
            </TabPane>

            <TabPane tab="Academics" key="2">
              <Form.Item
                label="Graduation Year"
                name="graduationyear"
                labelAlign="top"
              >
                <Input
                  defaultValue={data.graduationyear}
                  placeholder="Gradutaion Year"
                />
              </Form.Item>
              <Form.Item label="G.P.A. (Weighted)" name="gpa" labelAlign="top">
                <Input defaultValue={data.gpa} placeholder="GPA Weighted" />
              </Form.Item>
              <Form.Item label="G.P.A. (Unweighted)" name="gpauw" labelAlign="top">
                <Input defaultValue={data.gpauw} placeholder="GPA Weighted" />
              </Form.Item>
              <Form.Item
                label="SAT Overall"
                name="satOverall"
                labelAlign="top"
              >
                <Input
                  value={data.satOverall}
                  placeholder="SAT Overall"
                />
              </Form.Item>
              <Form.Item
                label="ACT"
                name="act"
                labelAlign="top"
              >
                <Input
                  value={data.act}
                  placeholder="ACT"
                />
              </Form.Item>
              <Form.Item
                label="ST/PROV."
                name="state"
                labelAlign="top"
              >
                <Input
                  value={data.state}
                  placeholder="ACT"
                />
              </Form.Item>
              <Form.Item
                label="JGSR"
                name="JGSR"
                labelAlign="top"
              >
                <Input
                  value={data.JGSR}
                  placeholder="JGSR"
                />
              </Form.Item>
            </TabPane>
            {/* QUILL 1 */}
            <TabPane tab="BIO" key="3">
              <Form.Item label="BIO" name="bioContent">
              <div className="editor-container">
              <ReactQuill
                  value={bioContent}
                  readOnly={false}
                  theme="snow"
                  className="editor"
                  modules={modules}
                  formats={formats}
                  onChange={(html) => {
                    setBioContent(html)
                  }}
                />
                </div>
              </Form.Item>
            </TabPane>
            <TabPane tab="References" key="4">
              <Form.Item label="References" name="refContent">
              <div className="editor-container">
              <ReactQuill
                  value={refContent}
                  readOnly={false}
                  theme="snow"
                  className="editor"
                  modules={modules}
                  formats={formats}
                  onChange={(html) => {
                    setRefContent(html)
                  }}
                />
                </div>
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
      <Footer />
    </div>
  );
};

export default ProfileDefault