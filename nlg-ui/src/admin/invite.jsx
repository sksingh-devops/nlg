import React, { useState, useEffect } from "react";
import { getBaseUrl } from "../config/apiconfig";
import Navbar from "../navbar/navbar";
import { Link, useNavigate } from "react-router-dom";
import { SearchOutlined, UserOutlined, WechatOutlined } from "@ant-design/icons";
import { Form, Input, Select, Button, Modal } from "antd";
import { Space, Table, Checkbox } from "antd";
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import Footer from "../footer/footer";
import CoachAssign from "./coachAssign";
import styles from './invite.module.css';
import AdminVisitorChat from "./adminVisitorChat";
import {MdLeaderboard} from "react-icons/md";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import {  Menu } from 'antd';
import { FaNewspaper } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem('User Management', '1', <UserOutlined />),
  getItem('Programs', '2', <DesktopOutlined />),
  getItem('Session Test', '3', <FaNewspaper />),
  getItem('Leader Board', '4', <MdLeaderboard />),
  getItem('MemberChat', '5', <WechatOutlined />),
  getItem('Notifications', '6', <IoMdNotificationsOutline/>),
];
const { Option } = Select;
const baseUrl = getBaseUrl();
const loginEndpoint = `${baseUrl}/invite`;
const DataEndPoint = `${baseUrl}/users`;
const UserActionEndPoint = `${baseUrl}/user/action`;
const Invite = (props) => {
  const { Search } = Input;
  const navigate = useNavigate();
  const handleTableAction = async (record, action) => {
    const storedToken = localStorage.getItem("token");
    const endpoint = `${UserActionEndPoint}/${action}/${record._id}`;
    axios
      .get(endpoint, {
        headers: {
          authorization: storedToken,
        },
      })
      .then((response) => {
        toastr.success(response.data?.message || "Done");
        fetchData();
      })
      .catch((error) => {
        toastr.error(error?.response?.data?.message || "Something went wrong");
      });
  };
  const [data, setdata] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
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
  useEffect(() => {
    fetchData();
  }, []);

  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

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
        record.name?.toLowerCase().includes(value.trim().toLowerCase()),
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
        record.email?.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Business Profile",
      dataIndex: "businessUrl",
      key: "businessUrl",
      render: (text) => (
        <a href={text} target="_blank" rel="noreferrer">
          {text}
        </a>
      ),
    },

    {
      title: "Linkedin Profile",
      dataIndex: "linkedinProfile",
      key: "linkedinProfile",
      render: (text) => (
        <a href={text} target="_blank" rel="noreferrer">
          {text}
        </a>
      ),
    },

    {
      title: "Action",
      key: "action",
      sorter: (a, b) => {
        if (a.isApproved === b.isApproved) {
          return 0;
        } else if (a.isApproved) {
          return 1;
        } else {
          return -1;
        }
      },
      render: (_, record) => (
        <Space size="middle">
          {!record.isApproved && (
            <span
              onClick={() => {
                handleTableAction(record, "approve");
              }}
              style={{
                color: "lightgreen",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              {" "}
              Approve{" "}
            </span>
          )}
          {!record.isApproved && (
            <span
              onClick={() => {
                handleTableAction(record, "reject");
              }}
              style={{ color: "darkred", fontSize: "16px", cursor: "pointer" }}
            >
              {" "}
              Reject{" "}
            </span>
          )}
          {record.isApproved && !record.isAdmin && (
            <>
              <span
                onClick={() => {
                  handleTableAction(record, "delete");
                }}
                style={{
                  color: "darkred",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                {" "}
                Remove{" "}
              </span>
              <span
                onClick={() => {
                  let action = record.isSuspended
                    ? "remove-suspend"
                    : "suspend";
                  handleTableAction(record, action);
                }}
                className={
                  record.isSuspended ? "suspended-text" : "not-suspended-text"
                }
                style={{ fontSize: "16px", cursor: "pointer" }}
              >
                {" "}
                {record.isSuspended ? "Reinstate" : "Suspend"}{" "}
              </span>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleInvite = async (email, name, role, sendemail) => {
   
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      await axios.post(
        loginEndpoint,
        { email, name, role, sendemail },
        {
          headers: {
            authorization: storedToken,
          },
        }
      );
      toastr.success("Invite sent successfully");
      closePopup();
      fetchData();
    } catch (error) {
      
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error.response?.data?.message || "Unable to send invite");
    }
  };

  const onFinish = (values) => {
    handleInvite(values.email, values.name ,  values.role, values.sendemail);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const tabsItems = [
    {
      label: 'Invite User',
      key: "1",
    },
    {
      label: 'Coach Assignment',
      key: "2",
    },
    {
      label: 'Visitor Chat',
      key: "3",
    },
    
  ];
  const [activeTab, setActiveTab] = useState("1");
  const handleTabClick = (key) => {
    setActiveTab(key);
    if (key === "1") {
      // openPopup();
    }
  };
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  
  const onClick = (e) => {
    console.log('click', e.key);
    if(e.key==2){
      navigate("/program")
    }
    if(e.key==3){
      navigate("/session")

    }
    if(e.key==4){
      navigate("/leader")
    }
    if(e.key==5){
      navigate("/chat")
    }
    if(e.key==6){
      navigate("/notifications")
    }
  };
  return (
    <div>
            <Navbar userdata={props.userdata} />
      <div className={styles.inviteParentContainer}> 
        {/* left side  */}

        <div
        className={styles.inviteLeftSide}
      
    >
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          margin:10
        }}
        className={styles.hideonmobile}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
      onClick={onClick}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        className={styles.menuHeight}
        style={{
          height: "95%",
        }}
      />
    </div>



        {/* Right SIde */}

        <section style={{ width : "100%" , backgroundColor: "#eee", minHeight: "80vh" }}>
        
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 className={styles.mainHeading} >User Management</h1>

          <Tabs
            defaultActiveKey="1"
            items={tabsItems}
            onTabClick={(key) => handleTabClick(key)}
          />
          <Modal
            title="Invite User to NLG"
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
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Email cannot be blank",
                  },
                  {
                    type: "email",
                    message: "Invalid Email",
                  },
                ]}
                labelAlign="top"
              >
                <Input pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" />
              </Form.Item>

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
                <Input />
              </Form.Item>
              <Form.Item
                label="Role"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please select role",
                  },
                ]}
                labelAlign="top"
              >
                <Select placeholder="Select  Role">
                  <Option value="coach">Coach</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="athlete">Athlete</Option>
                  <Option value="recruiter">Recruiter college</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="sendemail"
                initialValue={true}
                valuePropName="checked"
              >
                <Checkbox>Nofity On Email</Checkbox>
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
                  Send Invite
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        {activeTab ==="1" &&
                <div  style={{
            width: "100%",
            marginTop: "24px",
            display: "flex",
            
            justifyContent: "center",
          }}>
         <Button onClick={openPopup}>Invite user</Button>
        </div>}
        <div
        className={styles.tabCOntainer}
        >
          {activeTab === "2" && (
            <CoachAssign
              style={{
                width: "80%",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            />
          ) }
{activeTab === "1" && (
            <Table
            className={styles.inviteTable}
              columns={columns}
              dataSource={data}
              scroll={{ x: true }}
            />
            
          )}
          {
            activeTab==='3' &&
            
              <AdminVisitorChat/>
            
          }
        </div>
      </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Invite;
