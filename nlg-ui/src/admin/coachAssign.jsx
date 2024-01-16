import React, { useState, useEffect } from "react";
import { getBaseUrl } from "../config/apiconfig";
import Navbar from "../navbar/navbar";
import { Link } from "react-router-dom";
import { Form, Input, Select, Button, Modal } from "antd";
import { CiSquareRemove } from 'react-icons/ci';
import { Space, Table, Checkbox } from "antd";
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import Footer from "../footer/footer";
import { SearchOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import styles from './coachAssign.module.css'
const { Option } = Select;
const baseUrl = getBaseUrl();

const DataEndPoint = `${baseUrl}/assign/allathlete`;
const CoachEndPoint = `${baseUrl}/assign/allcoach`;
const assignEndPoint = `${baseUrl}/assign/assignment`;
const assignRMEndPoint = `${baseUrl}/assign/remove-coach-assignment`;
const CoachAssign = (props) => {
  const { Search } = Input;
  const [data, setdata] = useState([]);
  const [coachData, setcoachData] = useState([]);
  const handleTableAction = async (record, action) => {
    const storedToken = localStorage.getItem('token');
    const endpoint = `${assignRMEndPoint}/${record._id}`
    axios.delete(endpoint, {
      headers: {
        'authorization': storedToken
      }
    }).then((response) => {
      toastr.success(response.data?.message || "Coach Assignment removed");
      fetchData();
    }).catch(error => {
      toastr.error(error?.response?.data?.message || "Something went wrong");
    });

  }
  async function fetchData() {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get(DataEndPoint, {
        headers: {
          authorization: storedToken,
        },
      });

      const res = response.data;
      setdata(res);
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`Users Data Not Found`);
    }
  }
  async function fetchCoach() {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get(CoachEndPoint, {
        headers: {
          authorization: storedToken,
        },
      });

      const res = response.data;
      setcoachData(res);
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`Coach Data Not Found`);
    }
  }
  useEffect(() => {
    fetchData();
    fetchCoach();
  }, []);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectChange = (value, option) => {
    console.log(value);

    console.log(option);

    setSelectedOption(option);
  };

  const [selectedAthlte, setSelectedAthlte] = useState();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const openPopup = () => {
    setPopupVisible(true);
  };
  const closePopup = () => {
    setPopupVisible(false);
  };
  //  { "name":"athlete10","email":"gopalgupta36270+11@gmail.com","assignedCoachName":null,"assignedCoachEmail":null}
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Search
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <button
            className="btn-primary"
            onClick={() => confirm()}
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </button>
          <button
            onClick={() => {
              clearFilters();
              confirm();
            }}
            style={{ width: 90 }}
          >
            Reset
          </button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => {
        return (
          <Link
            className="font-weight-bold"
            to={`/profile-ath/${record.email}`}

            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            {" "}
            {text}{" "}
          </Link>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Search
            placeholder="Search email"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <button
            className="btn-primary"
            onClick={() => confirm()}
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </button>
          <button
            onClick={() => {
              clearFilters();
              confirm();
            }}
            style={{ width: 90 }}
          >
            Reset
          </button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
      record.email?.toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "Coach",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          {!record.assignedCoachEmail && (
            <span
              onClick={() => {
                // handleTableAction(record, "reject")
                setSelectedAthlte(record._id);
                openPopup();
              }}
              style={{ color: "darkred", fontSize: "16px", cursor: "pointer" }}
            >
              {" "}
              Assign{" "}
            </span>
          )}
          {record.assignedCoachEmail && (
            <>
              <span
                style={{ color: "darkgreen", fontSize: "16px", cursor: "pointer" }}
              >
                {" "}
                {record.assignedCoachEmail}
              </span>
              <span className="coach-rm" title="Remove Coach" onClick={() => {
              handleTableAction(record, "delete")
            }}>
                <CiSquareRemove style={{
                  fontSize:"20px",
                  color: "red",
                  height: "2em",
                  cursor: "pointer"
                }} />
              </span>
            </>
          )}
        </Space>
      ),
    },
  ];
  const handleAssign = async (coachId, athleteId) => {
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      await axios.post(
        assignEndPoint,
        { coachId, athleteId },
        {
          headers: {
            authorization: storedToken,
          },
        }
      );
      toastr.success("Coach Assigned successfully");
      closePopup();
      fetchData();
    } catch (error) {
      console.error("Login failed:", error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error.response?.data?.message || "Unable to assign Coach");
    }
  };
  const onFinish = (values) => {
    handleAssign(selectedOption.value, selectedAthlte);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
 
      <section style={{ backgroundColor: "#eee", minHeight: "100vh" , width:'100%' }}>
       
       

        <div
         className={styles.tabCOntainer}
        >
          <Table
           className={styles.inviteTable}
            columns={columns}
            dataSource={data}
            scroll={{ x: true }}
          />
        </div>

        <Modal
          title="Coach Assignment"
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
            <Form.Item label="Coach" name="coach" labelAlign="top">
              <Select
                labelInValue
                showSearch
                filterOption={(inputValue, option) =>
                  option.label
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) >= 0
                }
                value={selectedOption}
                onChange={handleSelectChange}
               
              >
                {coachData.map((item) => (
                  <Option key={item._id} value={item._id} label={item.email}>
                    {item.email}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                span: 24,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", height: "50px", fontSize: "20px" }}
              >
               Assign 
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </section>
      
  
  );
};

export default CoachAssign;
