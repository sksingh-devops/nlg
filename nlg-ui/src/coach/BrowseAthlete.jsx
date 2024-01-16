import React, { useState, useEffect } from "react";
import toastr from "toastr";
import axios from "axios";
import { Link } from 'react-router-dom';
import "toastr/build/toastr.min.css";
import { SearchOutlined } from '@ant-design/icons';
import { Space, Table, Input } from 'antd';
import { getBaseUrl } from "../config/apiconfig";
import { AiFillHeart } from 'react-icons/ai';
const baseUrl = getBaseUrl();
const DataEndPoint = `${baseUrl}/users/athletes`;
const BookmarkEndPoint = `${baseUrl}/bookmarks/athletes`;
const BrowseAthlete = () => {
  const { Search } = Input;
  const [data, setdata] = useState([])
  const [userBookmarks, setUserBookmarks] = useState([]);
  async function fetchData() {
    try {
      const storedToken = localStorage.getItem('token');
      const response = await axios.get(DataEndPoint, {
        headers: {
          'authorization': storedToken
        }
      });
      const res = response.data;

      const bookmarksRes = await axios.get(BookmarkEndPoint, {
        headers: {
          'authorization': storedToken
        }
      });

      const bookmarks = bookmarksRes.data?.bookmarks;
      if (bookmarks?.length > 0) {
        setUserBookmarks(bookmarks);
      }
      if (res?.length > 0) { setdata(res); }
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
  const isAthleteBookmarked = (athleteId) => {
     return userBookmarks.includes(athleteId);
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Search
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <button className="btn-primary" onClick={() => confirm()} style={{ width: 90, marginRight: 8 }}>
            Search
          </button>
          <button onClick={() => {clearFilters(); confirm()} } style={{ width: 90 }}>
            Reset
          </button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
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
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Search
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <button className="btn-primary" onClick={() => confirm()} style={{ width: 90, marginRight: 8 }}>
            Search
          </button>
          <button onClick={() => {clearFilters(); confirm()} } style={{ width: 90 }}>
            Reset
          </button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.email?.toLowerCase().includes(value.toLowerCase()),
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
              let action = isAthleteBookmarked(record._id) ? "unbookmark" : "bookmark"
              handleTableAction(record, action)
            }}
            className={record.isSuspended ? 'suspended-text' : 'not-suspended-text'}
            style={{ fontSize: '16px', cursor: 'pointer' }}> {isAthleteBookmarked(record._id) ? <AiFillHeart color="red" size={24} /> : <AiFillHeart color="grey" size={24} />} </span>
        </Space>
      ),
    },
  ];
  const emptyText = () => <span>No Athlete found. Browese and Select Favorite</span>;

  return (
    <div>
      <Table columns={columns} dataSource={data}scroll={{ x: true }}
        locale={{
          emptyText: emptyText,
        }} />
    </div>
  )
}

export default BrowseAthlete
