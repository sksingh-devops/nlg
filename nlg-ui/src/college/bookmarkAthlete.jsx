import React, { useState, useEffect } from 'react'
import { AiFillHeart } from 'react-icons/ai';
import toastr from "toastr";
import axios from "axios";
import { Link } from 'react-router-dom';
import "toastr/build/toastr.min.css";
import { Space, Table } from 'antd';
import { getBaseUrl } from "../config/apiconfig";
const baseUrl = getBaseUrl();
const DataEndPoint = `${baseUrl}/busers/bookmarked`;

const BookmarkAthlete = () => {
  const [data, setdata] = useState([])
  async function fetchData() {
    try {
      const storedToken = localStorage.getItem('token');
      const response = await axios.get(DataEndPoint, {
        headers: {
          'authorization': storedToken
        }
      });
      const res = response.data;
     // if (res?.length > 0) { setdata(res); }
     setdata(res); 
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: 'toast-top-full-width',
        hideDuration: 300,
        timeOut: 60000
      };
      toastr.clear();
      toastr.error(`Athletes Data Not Found`);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  const handleTableAction = async (record, action) => {
    const storedToken = localStorage.getItem('token');
    const endpoint = `${baseUrl}/${action}/${record._id}`
    axios.get(endpoint, {
      headers: {
        'authorization': storedToken
      }
    }).then((response) => {
      toastr.success(response.data?.message || "Done");
      fetchData();
    }).catch(error => {
      toastr.error(error?.response?.data?.message || "Something went wrong");
    });

  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (<Link className="font-weight-bold"
        to={`/profile-ath/${record.email}`}
          style={{ textDecoration: 'none', cursor: 'pointer' }}> {text} </Link>)
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Business Profile',
      dataIndex: 'businessUrl',
      key: 'businessUrl',
      render: (text) => <a href={text} target="_blank" rel="noreferrer" >{text}</a>
    },

    {
      title: 'Linkedin Profile',
      dataIndex: 'linkedinProfile',
      key: 'linkedinProfile',
      render: (text) => <a href={text} target="_blank" rel="noreferrer" >{text}</a>
    },

    {
      title: 'Favorite',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <span
            onClick={() => {
              let action = "unbookmark" 
              handleTableAction(record, action)
            }}
            className={record.isSuspended ? 'suspended-text' : 'not-suspended-text'}
            style={{ fontSize: '16px', cursor: 'pointer' }}> <AiFillHeart color="red" size={24} /> </span>
        </Space>
      ),
    },
  ];
  const emptyText = () => <span>No Athlete found. Browese and Select Favorite</span>;

  return (
    <div>
      <Table columns={columns} dataSource={data}
        locale={{
          emptyText: emptyText,
        }} />
    </div>
  )
}

export default BookmarkAthlete
