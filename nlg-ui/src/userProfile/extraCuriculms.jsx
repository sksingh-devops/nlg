import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
const ExtraCuriculms = ({ data }) => {
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

       
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}
        onClick={toggleCollapse}
      >
        <h2 style={{fontSize:'25px'}}>Extra Curiculum</h2>
        {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
      </div>
      <div className={`card-body ${isCollapsed ? "collapse" : ""}`}>
        <div className="row" style={{ height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 font-weight-bold">The Player Standard Bearer</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="text-muted mb-0">{data.thePlayerStandardBearer}</p>
          </div>
        </div>
        
        <div className="row"  style={{ backgroundColor: "rgb(96 211 109 / 50%)", height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 font-weight-bold">Mission House Volunteer</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="text-muted mb-0">{data.missionHouseVolunteer}</p>
          </div>
        </div>
        
        <div className="row" style={{ height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 font-weight-bold">Tim Tebow Torunament Volunteer</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="text-muted mb-0">
              {data.timTebowTournamentVolunteer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtraCuriculms;
