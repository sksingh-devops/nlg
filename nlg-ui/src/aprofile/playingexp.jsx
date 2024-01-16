import React, { useState, useEffect } from 'react';
import "react-quill/dist/quill.snow.css";
import { Select } from 'antd';
import { Space, Table, Tag } from 'antd';
import GolfDataForm from './addPlayingExp'
import toastr from "toastr";
import axios from "axios";
import moment from "moment";
import { getBaseUrl } from "../config/apiconfig";
import "toastr/build/toastr.min.css";
import { Modal, Form, Input, DatePicker, Button } from 'antd';
const { Option } = Select;

const { Column, ColumnGroup } = Table;

const PlayingExp = (props) => {
  const { isReadOnly, email } = props
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const tahtstyle = {
    color: '#256208',
    fontFamily: `"Roboto-Bold", Helvetica"`,
    fontSize: "40px",
    fontWeight: 700,
    marginRight: '10px'
  }
  const handleAddGolfData = async (tourData) => {
    tourData.date = moment(tourData.date).format('DD/MM/YY')
    addTour(tourData)
    
  }
  const addTour = async (val) => {
    const  endpoint = `${getBaseUrl()}/tour/add`;
     try {
       toastr.clear();
       const storedToken = localStorage.getItem("token");
       const response = await axios.post(endpoint,
         val,
         {
           headers: {
             authorization: storedToken,
           },
         }
       );
 
       toastr.success(response.data?.message || "Done");
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
   const handleTableAction = async (record)=>{
    const storedToken = localStorage.getItem('token');
    const  endpoint = `${getBaseUrl()}/tour/delete/${record._id}`
    axios.delete(endpoint, {
      headers: {
        'authorization': storedToken
      }
    }).then((response) => {
      toastr.success(response.data?.message || "PLAYING EXPERIENCE REMVOED");
      fetchData();
    }).catch(error => {
      toastr.error(error?.response?.data?.message || "Something went wrong");
    });
   }
  async function fetchData() {
    try {
      toastr.clear();
      let userAPI = `${getBaseUrl()}/tour/${email}`;
      const response = await axios.get(userAPI, {
      });
      setData(response.data);
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
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2000; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse(); // Reverse the order to display recent years first
  };
  const yearOptions = generateYearOptions();
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <span style={tahtstyle}>PLAYING EXPERIENCE</span>
          {!isReadOnly && <GolfDataForm
            visible={isModalVisible}
            onAdd={handleAddGolfData}
            onCancel={() => setIsModalVisible(false)}
          />}
        </div>

      </div>
      <div className="row">
        <div className="col-md-12">
          {/* <div className='col-md-2'> */}
          <Select
            defaultValue={new Date().getFullYear()} // Set the default year to the current year
            style={{ width: "25%", backgroundColor: '#CBCBCB' }}
          >
            {yearOptions.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>

        </div>
        <div className="col-md-12" style={{ marginTop: '10px' }}>
          <Table dataSource={data} bordered className="custom-table" scroll={{ x: true }} >
            <Column title="DATE" dataIndex="date" key="date"
            render={(text)=>(moment(text).format('DD/MM/YY'))} />
            <Column title="TOURNAMENT NAME" dataIndex="tournamentName" key="tournamentName" />
            <ColumnGroup title="ROUNDS">
              <Column title="1" dataIndex='r1' className="score-cell" key="r1" render={(text) => (text ? text : '-')} />
              <Column title="2" dataIndex='r2' className="score-cell" key="r2" render={(text) => (text ? text : '-')} />
              <Column title="3" dataIndex='r3' className="score-cell" key="r3" render={(text) => (text ? text : '-')} />
              <Column title="4" dataIndex='r4' className="score-cell" key="r4" render={(text) => (text ? text : '-')} />
            </ColumnGroup>
            <Column title="TOTAL" dataIndex="total" key="total" />
            <Column title="FINAL POS" className="score-cell" dataIndex="finalPOS" key="finalPOS" />
            <Column title="TOT STROKES" className="score-cell" dataIndex="totalStrokes" key="totalStrokes" />
            <Column title="TOT ROUNDS" className="score-cell" dataIndex="totRounds" key="totRounds" />
            <Column title="AVG SCORE" className="score-cell" dataIndex="avgScore" key="avgScore" />
            {!isReadOnly && <Column title="REMOVE" key="rm" render ={(_, record) => (<span
              onClick={() => {
                handleTableAction(record);
              }}
              style={{ color: "darkred", fontSize: "16px", cursor: "pointer" }}
            >
              {" "}
              Remove{" "}
            </span>)} />
            }
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PlayingExp;
