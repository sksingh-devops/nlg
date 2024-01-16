import React from 'react'
import Navbar from "../navbar/navbar";
import { Calendar } from 'antd';
const CalendarPage = (props) => {
    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
      };
  return (
    <div>
      <Navbar userdata={props.userdata} />

      <div style={{width:'100%', display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <h1 style={{fontSize:"80px", textAlign:'center', margin:'20px'}}>Calendar</h1>
      <Calendar style={{width:'80%',border:'1px solid black', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}} onPanelChange={onPanelChange} />
      </div>
    </div>
  )
}

export default CalendarPage
