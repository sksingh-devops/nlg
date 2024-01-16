import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
const Academics = ({ data }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div className="card mb-4">
      <div
        className="card-header d-flex"
        style={{
          justifyContent: "space-between",
          color: "greenyellow",
          
          backgroundColor: "black",

          fontSize: "20px",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}
        onClick={toggleCollapse}
      >
        <h2 style={{fontSize:'25px'}}>Academics</h2>
        {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
      </div>
      <div className={`card-body ${isCollapsed ? "collapse" : ""}`}>
        <div className="row" style={{ height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 font-weight-bold">GPA</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="text-muted mb-0">{data.gpa}</p>
          </div>
        </div>
        
        <div className="row"  style={{ backgroundColor: "rgb(96 211 109 / 50%)", height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 font-weight-bold">SAT Overall</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="text-muted mb-0">{data.satOverall}</p>
          </div>
        </div>
        
        <div className="row" style={{ height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 font-weight-bold">Reading</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="text-muted mb-0">{data.reading}</p>
          </div>
        </div>
        
        <div className="row"  style={{ backgroundColor: "rgb(96 211 109 / 50%)", height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 font-weight-bold">Mathematics</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="text-muted mb-0 ">{data.mathematics}</p>
          </div>
        </div>
        
        <div className="row" style={{ height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 font-weight-bold">Writing</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="text-muted mb-0">{data.writing}</p>
          </div>
        </div>
        
        <div className="row"  style={{ backgroundColor: "rgb(96 211 109 / 50%)", height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 font-weight-bold">NCAA Eligiblity Center #</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="text-muted mb-0">{data.ncaaEligiblityCenter}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academics;
