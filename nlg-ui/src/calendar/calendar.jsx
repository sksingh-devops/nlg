import React from 'react'
import Navbar from "../navbar/navbar";
import { Calendar } from 'antd';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Footer from '../footer/footer';

const CalendarPage = (props) => {
    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
      };
  return (
    <div>
      <Navbar userdata={props.userdata} />

      <div style={{width:'100%', display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', marginBottom:"10px"}}>
        <h1 style={{fontSize:"70px", textAlign:'center', margin:'20px'}}>CALENDAR</h1>
      {/* <Calendar style={{width:'80%',border:'1px solid black', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}} onPanelChange={onPanelChange} /> */}
      <div style={{width:'80%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}} >
      <FullCalendar
        plugins={[dayGridPlugin]}
        headerToolbar={{
          left: "prev,title,next",
         
          right: "dayGridMonth,today",
        }}
        initialView="dayGridMonth"
        editable={false}
        selectable={true}
        selectMirror={false}
        dayMaxEvents={false}
         // Change to your desired initial view
       
      />
      </div>
      </div>
      <Footer/>
    </div>
  )
}

export default CalendarPage
