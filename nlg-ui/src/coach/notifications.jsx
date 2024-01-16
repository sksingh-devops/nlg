import React, { useState, useEffect } from "react";
import styles from './notification.module.css';

import { getBaseUrl } from "../config/apiconfig";
import { Button } from 'antd';
import { Pagination } from 'antd';

import { FaBell, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import moment from 'moment';
const pageSize = 5; // Number of items per page
const baseUrl = getBaseUrl();
const DataEndPoint = `${baseUrl}/notifications`;
const Notifications = ({setParentReadCount}) => {
  const [data, setdata] = useState([])
  const [unread, setunread] = useState([])
  async function fetchData() {
    try {
      const storedToken = localStorage.getItem('token');
      const response = await axios.get(DataEndPoint, {
        headers: {
          'authorization': storedToken
        }
      });

      const { notifications, unreadCount } = response.data;
      setdata(notifications);
      setunread(unreadCount)
      setParentReadCount&& setParentReadCount(unreadCount);
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: 'toast-top-full-width',
        hideDuration: 300,
        timeOut: 60000
      };
      toastr.clear();
      toastr.error(`Users Data Not Found`);
    }
  }
  useEffect(() => {
    fetchData();
  }, [])

  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };
  const clearAll = async function(){
    const storedToken = localStorage.getItem('token');
    const endpoint = `${baseUrl}/notifications/clear`
    axios.delete(endpoint,{
      headers: {
        'authorization': storedToken
      }
    }).then((response) => {
      fetchData();
    }).catch(error => {
      toastr.error(error?.response?.data?.message || "Something went wrong");
    });
  }
  const markAllRead = async function(){
    const storedToken = localStorage.getItem('token');
    const endpoint = `${baseUrl}/notifications/mark-read/`
    axios.put(endpoint,{},{
      headers: {
        'authorization': storedToken
      }
    }).then((response) => {
      fetchData();
    }).catch(error => {
      toastr.error(error?.response?.data?.message || "Something went wrong");
    });
  }
  const markRead = async function(isRead,id ){
  if (isRead){
    return
  }
    const storedToken = localStorage.getItem('token');
    const endpoint = `${baseUrl}/notifications/${id}/mark-read`
    axios.put(endpoint, {},{
      headers: {
        'authorization': storedToken
      }
    }).then((response) => {
      fetchData();
    }).catch(error => {
      toastr.error(error?.response?.data?.message || "Something went wrong");
    });
  }
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div>
      <div className={` ${styles.markAllAsReadRow}`} >
        <div>
        <Button
        onClick={markAllRead}
        type="primary" style={{ backgroundColor: 'green', marginRight: '10px' }} >Mark All as read</Button>
        <Button
        onClick={clearAll}
        style={{ backgroundColor: 'grey', color: "white", marginRight: '10px' }} >Clear All</Button>
        </div>  
        <div className={styles.unreadCount}>
          <FaBell />
          <span>{unread}</span>
        </div>

      </div>

      {/* array of div's that must be come from backend */}
      { currentData?.length > 0 && <div className={styles.notificationContainer}>
        {currentData.map((item) => (
          <div
            className={`${styles.notification} ${item.isRead ? styles.read : styles.unread
              }`}
            key={item.time}
            onClick={()=>markRead(item.isRead,item._id )}
          >
            <div className={styles.message}>
              <p className="info">{item.message}</p>
              <p className={styles.time}>{moment(item.createdAt).fromNow()}</p>
            </div>
            <div className={styles.readIcon}>
              {item.isRead ? <FaEnvelopeOpen /> : <FaEnvelope />}
            </div>
          </div>
        ))}
        <div className={styles.pagination}>
          <Pagination
            current={currentPage}
            onChange={handleChangePage}
            pageSize={pageSize}
            total={data.length}
          />
        </div>
      </div> }

    </div>
  )
}

export default Notifications
