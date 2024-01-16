import React, { useEffect, useState } from 'react'
import Navbar from '../navbar/navbar'
import { Link, useNavigate } from 'react-router-dom';
import styles from './athletedashboard.module.css';
import { Button, Progress, Tabs } from 'antd';
import { AiOutlineRight } from 'react-icons/ai';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Footer from '../footer/footer';
import Notifications from '../coach/notifications';
import { getBaseUrl } from '../config/apiconfig';
import axios from 'axios';
import ReportsByCoach from '../coach/ReportsByCoach';
import BrowseAthlete from '../coach/BrowseAthlete';
import BookmarkAthlete from '../coach/bookmarkAthlete';
import {MdLeaderboard, MdOutlineLeaderboard} from "react-icons/md";
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
import { FaNewspaper, FaRegNewspaper } from "react-icons/fa";
import SessionList from '../session/sessionlist';
import Lead from '../leaderboard/lead';
import ReplicateSessionList from '../session/ReplicateSessionList';
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
const baseUrl = getBaseUrl();
const DataEndPoint = `${baseUrl}/notifications/count`;

const Athletedashboard = (props) => {
  const navigate = useNavigate();
  const [unread, setunread] = useState([])
  async function fetchData() {
    try {
      const storedToken = localStorage.getItem('token');
      const response = await axios.get(DataEndPoint, {
        headers: {
          'authorization': storedToken
        }
      });

      const { unreadCount } = response.data;
      
      setunread(unreadCount)
    } catch (error) {
     
    }
  }
  useEffect(() => {
    fetchData();
  }, [])
       
  const tabsItems = [
    
   
    
    
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
          height: "93%",
        }}
      />
    </div>



        {/* Right SIde */}

      <div className={styles.container1}>
       
        <div className={styles.contentContainer}>
          {/* {activeTab === "1" && <ReportsByCoach />} */}
          {activeTab === "1" && <ReplicateSessionList />}
            
    </div>
      </div>
      </div>
      <Footer />  
    </div>
  )
}

export default Athletedashboard
