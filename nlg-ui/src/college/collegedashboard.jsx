import React,{useState,useEffect} from 'react'
import Navbar from '../navbar/navbar'
import { Link, useNavigate } from 'react-router-dom';
import styles from './collegedashboard.module.css';
import { Button, Progress, Tabs } from 'antd';
import { FaBookmark ,FaGlobe, FaRegNewspaper} from 'react-icons/fa';
import { MdOutlineGolfCourse,MdNotifications, MdOutlineLeaderboard } from 'react-icons/md';
import { TbReportSearch } from 'react-icons/tb';
import { AiFillHeart } from 'react-icons/ai';
import Footer from '../footer/footer';
import { Table } from 'antd';
import ReportsByCoach from './ReportsByCoach';
import BrowseAthlete from './BrowseAthlete';
import BookmarkAthlete from './bookmarkAthlete';
import {MdLeaderboard} from "react-icons/md";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UserOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import {  Menu } from 'antd';
import { FaNewspaper } from "react-icons/fa";
import { IoMdNotificationsOutline } from 'react-icons/io';
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
  getItem('Dashboard', '1', <UserOutlined />),
  getItem('Programs', '2', <DesktopOutlined />),
  getItem('Session Test', '3', <FaRegNewspaper />),
  getItem('Leader Board', '4', <MdOutlineLeaderboard />),
  getItem('MemberChat', '5', <WechatOutlined />),
  getItem('Notifications', '6', <IoMdNotificationsOutline/>),
];
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },{
    title: 'Favorite ', // Column title for the heart icon
    dataIndex: 'Favorite ', // You can use any unique dataIndex here
    render: () => <AiFillHeart color="grey"  size={24} />, // Render the heart icon using the render function
  },
];
const data = [];
for (let i = 0; i < 270; i++) {
  data.push({
    key: i,
    name: `Athlete ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
    isFavorite : false
  });
}

const Collegedashboard = (props) => {
  const navigate = useNavigate();
  let [name,setname] = useState("");
  useEffect(()=>{
    const name = localStorage.getItem("name");
    setname(name)
  },[name])
   
        // const component = "table"; 
    const[component,setComponent] = useState("table");
   const componentHandler = (value)=>{
            // component = value;
            setComponent(value);
            console.log(value);
   }
    
  const tabsItems = [
    // {
    //   label: 'Reports',
    //   key: "1",
    // },
    {
      label: 'Browse Athlete',
      key: "1",
    },
    {
      label: 'Bookmark Athlete',
      key: "2",
    },
    
  ];
  const [activeTab, setActiveTab] = useState("1");
  const handleTabClick = (key) => {
    setActiveTab(key);
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
      margin:10,
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

  <div className={styles.container1}>
    <h1>Dashboard</h1>
       <Tabs
        defaultActiveKey="1"
        items={tabsItems}
        onTabClick={(key) => handleTabClick(key)}
      />
    <div className={styles.contentContainer}>
      {/* {activeTab === "1" && <ReportsByCoach />} */}
      {activeTab === "1" && <BrowseAthlete />}
      {activeTab === "2" && <BookmarkAthlete />}    
</div>
  </div>
  </div>
  <Footer />  
</div>
  )
}

export default Collegedashboard
