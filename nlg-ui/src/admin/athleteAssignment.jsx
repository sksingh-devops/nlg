import { Button, Checkbox, Form, Modal, Select, Space, Table } from "antd";
import React from "react";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import { useState } from "react";
import toastr from "toastr";
import "./athleteAssignTable.css";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

import { getBaseUrl } from "../config/apiconfig";
import "toastr/build/toastr.min.css";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { BsPlusCircleDotted } from "react-icons/bs";
const getTableDataEndPoint = `${getBaseUrl()}/assigned-users`;
const assignEndPoint = `${getBaseUrl()}/assign-test`;
const deleteEndPoint = `${getBaseUrl()}/remove-user-from-test`;
const SearchChatUser = `${getBaseUrl()}/chat/search`;
const testEndPoint = `${getBaseUrl()}/tests`;
const AthleteAssignment = (props) => {
  let { id } = useParams();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState();
  const openPopup = () => {
    setPopupVisible(true);
    
  };

  const closePopup = () => {
    setPopupVisible(false);
  };
  const onFinish = (values) => {};

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [data, setData] = useState([]);
  const [tabledata, setTableData] = useState([]);
  const [drowndownuser, setDrowndownuser] = useState([]);
  
  const [testIdData, setTestIdData] = useState([]);

  const handleUserChange = (value) => {
    setSelectedUserID(value);
    // AssignAthlete(value);
    // closePopup();
  };
  async function fetchtestData() {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get(`${testEndPoint}/${id}`, {
        headers: {
          authorization: storedToken,
        },
      });

      const res = response.data;
      setTestIdData(res.test);
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(` Test Not Found`);
    }
  }
  async function fetchData() {
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      let userAPI = `${getBaseUrl()}/rank-allathlete`;
     
      const response = await axios.get(userAPI, {
        headers: {
          authorization: storedToken,
        },
      });
      setData(response.data);
      
      const userOptions = [
        
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
    }
  }
  async function fetchTableData() {
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");

      let userAPI = `${getTableDataEndPoint}/${id}`;

      const response = await axios.get(userAPI, {
        headers: {
          authorization: storedToken,
        },
      });
      setTableData(response.data.assignedUsers);
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
    }
  }
  async function AssignAthlete(userId) {
    try {
      const storedToken = localStorage.getItem("token");
      const Endpoint = `${assignEndPoint}/${id}/${userId}`;
      const response = await axios.post(
        Endpoint,
        {},
        {
          headers: {
            authorization: storedToken,
          },
        }
      );
      toastr.success("Athlete assigned successfully");
      fetchTableData();
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
  useEffect(() => {
    fetchData();
    fetchTableData();
    fetchtestData();
  }, []);


 
  const handleTableAction = async (record) => {
    const storedToken = localStorage.getItem("token");
    const endpoint = `${deleteEndPoint}/${id}/${record._id}`;
    axios
      .delete(endpoint, {
        headers: {
          authorization: storedToken,
        },
      })
      .then((response) => {
        toastr.success(response.data?.message || "Done");
        fetchTableData();
      })
      .catch((error) => {
        toastr.error(error?.response?.data?.message || "Something went wrong");
      });
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {

        const displayText = text?.trim() || record.email; 
        return (
          <Link
            className="font-weight-bold"
            to={`/profile-ath/${record.email}`}
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            {" "}
            {displayText}{" "}
          </Link>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Remove",
      key: "action",
      render: (_, record) => (
        <span
          onClick={() => {
            handleTableAction(record);
          }}
          style={{ fontSize: "16px", color:'red',cursor: "pointer" }}
        >
          {" "}
          <DeleteOutlined  size={24} />{" "}
        </span>
      ),
    },
  ];
  const emptyText = () => <span>No Assign Athlete found</span>;
  const assignApihandler = ()=>{
    AssignAthlete(selectedUserID);
    setSelectedUserID();
    closePopup();
  }
  return (
    <div>
      <Navbar userdata={props.userdata} />
      <div className="assignMainContainer">
        <div className="assignTestNameContainer">
          <p className="assigntestName">{testIdData.name}</p>

         
        </div>
        <div style={{ display:'flex',  justifyContent:'center', alignItems:'center'}} >
        <video controls className="assignlevelVideo" key={testIdData.videoPath}>
          <source
            src={`${getBaseUrl()}/${testIdData?.videoPath}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        </div>
        <Modal
         okText="Assign"
         cancelText="Cancel"
          title="Assign Athlete"
          visible={isPopupVisible}
          onCancel={closePopup}
          onOk={assignApihandler}
         
        >
          <Form
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item width="100%">
              <Select
                showSearch
               
                placeholder={
                  <span
                    style={{
                      width: "100%",
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                      color: "black",
                    }}
                    allowClear
                  >
                    Select Athlete
                  </span>
                }
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                optionFilterProp="children"
                onChange={handleUserChange}
                value={selectedUserID}
                options={drowndownuser}
              />
            </Form.Item>
          </Form>
        </Modal>
                <div className="assign-athlete-button">
        <Button
        className=""
       
            onClick={openPopup}
          > Assign Athlete</Button>
          </div>
        <div
          style={{
            width: "100%",
            marginTop: "24px",
            display: "flex",

            justifyContent: "center",
          }}
        >
           
          <Table
            className="assignathleteTable"
            columns={columns}
            dataSource={tabledata}
            scroll={{ x: true }}
            locale={{
              emptyText: emptyText,
            }}
            pagination={false}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AthleteAssignment;
